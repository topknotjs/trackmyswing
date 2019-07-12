const fDB = require('../handlers/fireDB');
const sanitizeEmail = require('../utils/sanitizeEmail');
const Account = require('../definitions/Account');
const Attendance = require('../definitions/Attendance');
class AccountServices {
  constructor() {
    this.fireDB = fDB();
  }
  async writeAttendanceToEvent(eventId, accountId) {
    try {
      const account = await this.fireDB.getAccountById(accountId);
      const event = await this.fireDB.getEvent(eventId);
      const currAttendance = account.getAttendance(event.eventId);
      if (currAttendance !== null) {
        throw new Error(
          `Account ${accountId} already attending event ${eventId}`
        );
      }
      const attendance = new Attendance({ event });
      const addResult = account.addAttendance(attendance);
      if (!addResult) {
        throw new Error(account.getError());
      }
      return await this.fireDB.updateAccountInFirebase(accountId, account);
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }
  async removeAttendanceFromEvent(eventId, accountId) {
    try {
      const account = await this.fireDB.getAccountById(accountId);
      const currAttendance = account.getAttendance(eventId);
      if (currAttendance === null) {
        throw new Error(
          `Event ID: ${eventId} does not exist for account id: ${accountId}`
        );
      }
      const removeResult = account.removeAttendance(currAttendance);

      if (!removeResult) {
        throw new Error(account.getError());
      }
      return await this.fireDB.updateAccountInFirebase(accountId, account);
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }
  async writePartnershipNameToAccount(eventId, accountId, partnerName) {
    try {
      const account = await this.fireDB.getAccountById(accountId);
      let attendance = account.getAttendance(eventId);
      if (!attendance) {
        const event = await this.fireDB.getEvent(eventId);
        attendance = new Attendance({ event });
        const addResult = account.addAttendance(attendance);
        if (!addResult) {
          throw new Error(account.getError());
        }
      } else {
        attendance.addPartnerName(partnerName);
        account.setAttendance(attendance);
      }
      return await this.fireDB.updateAccountInFirebase(accountId, account);
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }
  async writePartnershipWsdcidToAccount(eventId, accountId, wsdcid) {
    try {
      const account = await this.fireDB.getAccountById(accountId);
      let attendance = account.getAttendance(eventId);
      if (!attendance) {
        const event = await this.fireDB.getEvent(eventId);
        attendance = new Attendance({ event });
        const addResult = account.addAttendance(attendance);
        if (!addResult) {
          throw new Error(account.getError());
        }
      } else {
        const dancer = await this.fireDB.getDancer(wsdcid);
        attendance.addPartnerDancer(dancer);
        account.setAttendance(attendance);
      }

      return await this.fireDB.updateAccountInFirebase(accountId, account);
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }

  async writePartnerToAttendance(eventId, accountId) {
    try {
      const account = this.fireDB.getAccountById(accountId);
      const event = this.fireDB.getEvent(eventId);
      return await this.fireDB.writeAccountToEvent(eventId, accountId);
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error);
    }
  }

  async login(email, password, facebookId) {
    try {
      return await this.fireDB.loginAccount(email, password, facebookId);
    } catch (error) {
      console.log('Login error: ', error);
      throw new Error(error);
    }
  }
  async getAccountByEmail(email) {
    const sanitized = sanitizeEmail(email);
    try {
      return await this.fireDB.getAccountByEmail(sanitized);
    } catch (error) {
      console.log('Get account by email error: ', error);
      throw new Error(error);
    }
  }
  async getAccountById(id) {
    try {
      return await this.fireDB.getAccountById(id);
    } catch (error) {
      console.log('Get account by id error: ', error);
      throw new Error(error);
    }
  }

  async upsertAccount(accountData) {
    if (!accountData.accountId && !accountData.email) {
      throw new Error('Missing accountId or email');
    }
    let account = new Account(accountData);
    if (account.hasError()) {
      throw new Error(account.getError());
    }
    try {
      // TODO: Make this not be a full "get the entire duplicat account". we don't need the whole thing here
      let dupAccount = null;
      if (account.accountId) {
        dupAccount = await this.fireDB.getAccountById(account.accountId);
      } else {
        dupAccount = await this.fireDB.getAccountByEmail(account.email);
      }
      console.log('Dup account: ', dupAccount);
      if (dupAccount instanceof Account) {
        if (account.wsdcId !== dupAccount.wsdcId) {
          const dancer = await this.fireDB.getDancer(account.wsdcId);
          account.processDancer(dancer);
        }
        return await this.fireDB.updateAccountInFirebase(
          dupAccount.accountId,
          account
        );
      } else {
        const dancer = await this.fireDB.getDancer(account.wsdcId);
        account.processDancer(dancer);
        console.log('Processed account: ', account);
        const accountId = await this.fireDB.writeAccountToFirebase(account);
        return await this.fireDB.getAccountById(accountId);
      }
    } catch (error) {
      console.log('upsert error: ', error);
      throw new Error(error);
    }
  }
  // TODO: update this
  async updateAccount(id, accountData) {
    if (!id && !accountData) {
      throw new Error('Missing accountId or email');
    }
    try {
      console.log('Update account');
      return await this.fireDB.updateAccountInFirebase(id, accountData);
    } catch (error) {
      console.log('update error: ', error);
      throw new Error(error);
    }
  }
}

module.exports = AccountServices;
