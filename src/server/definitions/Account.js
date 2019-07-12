const bcrypt = require('bcrypt');
const Dancer = require('./Dancer');
const Attendance = require('./Attendance');
// TODO: Add error logging
// TODO: Make the constructor parse what's coming from the database and a separate method for parsing wsdc crap

class Account {
  constructor(data) {
    const dancer = null;
    this.accountId = '';
    this.username = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.profileImageUrl = '';
    this.wsdcId = null;
    this.wsdcDancer = null;
    this.attendances = [];
    this.facebookId = null;
    this.location = '';
    this.password = '';
    this._error = false;

    if (!data) return;
    if (!Account.ValidateAccount(data)) {
      return;
    }
    this.processAccount(data);
  }
  toJSON(full = false) {
    const base = {
      accountId: this.accountId,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      profileImageUrl: this.profileImageUrl,
      wsdcId: this.wsdcId,
      wsdcDancer: this.wsdcDancer === null ? null : this.wsdcDancer.toJSON(),
      attendances: this.attendances.reduce((acc, attendance) => {
        acc.push(attendance.toJSON());
        return acc;
      }, []),
      facebookId: this.facebookId,
      location: this.location,
    };
    return full
      ? {
          ...base,
          password: this.password,
        }
      : base;
  }
  setError(msg) {
    this._error = msg;
  }
  getError() {
    return this._error;
  }
  processAccount(data) {
    this.accountId = data.hasOwnProperty('accountId') ? data.accountId : '';
    this.username = data.hasOwnProperty('username') ? data.username : '';
    this.email = data.hasOwnProperty('email') ? data.email : '';
    this.firstName = data.hasOwnProperty('firstName') ? data.firstName : '';
    this.lastName = data.hasOwnProperty('lastName') ? data.lastName : '';
    this.profileImageUrl = data.hasOwnProperty('profileImageUrl')
      ? data.profileImageUrl
      : '';
    this.wsdcId = data.hasOwnProperty('wsdcId') ? data.wsdcId : '';
    this.wsdcDancer = data.hasOwnProperty('wsdcDancer')
      ? new Dancer(data.wsdcDancer)
      : null;
    this.facebookId = data.hasOwnProperty('facebookId') ? data.facebookId : '';
    this.location = data.hasOwnProperty('location') ? data.location : '';
    this.password = data.hasOwnProperty('password')
      ? bcrypt.hashSync(data.password, 10)
      : '';
    if (this.email === '') {
      this.setError('No email on account.');
    }

    if (data.hasOwnProperty('attendances')) {
      for (let key in data.attendances) {
        this.attendances.push(new Attendance(data.attendances[key]));
      }
    }
  }
  // TODO: Include some more processing, maybe wsdcId checking here
  processDancer(dancer) {
    this.wsdcDancer = dancer;
  }
  addAttendance(attendance) {
    // TODO: Insert attendance in order?
    for (let i = 0, len = this.attendances.length; i < len; i++) {
      if (this.attendances[i].event.eventId === attendance.event.eventId) {
        this.setError(`${attendance.event.eventId} already exists for account`);
        return false;
      }
    }
    this.attendances.push(attendance);
    return true;
  }
  removeAttendance(attendance) {
    // TODO: Insert attendance in order?
    const newAttendances = this.attendances.filter(
      (att, idx) => att.event.eventId !== attendance.event.eventId
    );
    if (this.attendances.length !== newAttendances.length) {
      this.attendances = newAttendances;
      return true;
    } else {
      this.setError(`${attendance.event.eventId} does not exist`);
      return false;
    }
  }
  setAttendance(attendance) {
    for (let i = 0, len = this.attendances.length; i < len; i++) {
      if (this.attendances[i].event.eventId === attendance.event.eventId) {
        this.attendances[i] = attendance;
        return;
      }
    }
    this.attendances.push(attendance);
  }
  getAttendance(eventId) {
    for (let i = 0, len = this.attendances.length; i < len; i++) {
      if (this.attendances[i].event.eventId === eventId) {
        return this.attendances[i];
      }
    }
    return null;
  }
  addUnassignedPartnership() {}
  hasError() {
    return this._error;
  }
  Copy(data) {
    for (let key in this) {
      if (
        !this.hasOwnProperty(key) ||
        !data.hasOwnProperty(key) ||
        !data[key]
      ) {
        continue;
      }

      this[key] = data[key];
    }
  }
  static ValidateAccount(data) {
    return true;
  }
  static AccountFromFirebase(data) {
    let newAccount = new Account();
    for (let key in this) {
      if (
        !newAccount.hasOwnProperty(key) ||
        !data.hasOwnProperty(key) ||
        !data[key]
      ) {
        continue;
      }

      newAccount[key] = data[key];
    }
    return newAccount;
  }

  static CheckPasswordAgainstHashed(password, hashed) {
    return bcrypt.compareSync(password, hashed);
  }
}
module.exports = Account;
