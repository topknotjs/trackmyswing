const fDB = require('../handlers/fireDB');
const sanitizeEmail = require('../utils/sanitizeEmail');
const Account = require('../definitions/Account');
class AccountServices {
	constructor() {
		this.fireDB = fDB();
	}
	async writeAttendanceToEvent(eventId, accountId) {
		try {
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
			const dupAccount = await this.fireDB.getAccountByEmail(
				account.Email
			);
			if (dupAccount instanceof Account) {
				return await this.fireDB.updateAccountInFirebase(
					dupAccount.AccountId,
					accountData
				);
			} else {
				const accountId = await this.fireDB.writeAccountToFirebase(
					account
				);
				return await this.fireDB.getAccountById(accountId);
			}
		} catch (error) {
			console.log('upsert error: ', error);
			throw new Error(error);
		}
	}
	async updateAccount(id, accountData) {
		if (!id && !accountData) {
			throw new Error('Missing accountId or email');
		}
		try {
			return await this.fireDB.updateAccountInFirebase(id, accountData);
		} catch (error) {
			console.log('upsert error: ', error);
			throw new Error(error);
		}
	}
}

module.exports = AccountServices;
