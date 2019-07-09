const bcrypt = require('bcrypt');
const Dancer = require('./Dancer');
const Attendance = require('./Attendance');
// TODO: Add error logging
// TODO: Make the constructor parse what's coming from the database and a separate method for parsing wsdc crap

class Account {
	constructor(data) {
		const dancer = null;
		this.AccountId = '';
		this.Username = '';
		this.Email = '';
		this.FirstName = '';
		this.LastName = '';
		this.ProfileImageUrl = '';
		this.Wsdcid = null;
		this.WsdcDancer = null;
		this.Attendances = [];
		this.FacebookId = null;
		this.Location = '';
		this.Password = '';
		this._error = false;

		if (!data) return;
		if (!Account.ValidateAccount(data)) {
			return;
		}
		this.processAccount(data);
	}
	toJSON(full = false) {
		const base = {
			accountId: this.AccountId,
			username: this.Username,
			email: this.Email,
			firstName: this.FirstName,
			lastName: this.LastName,
			profileImageUrl: this.ProfileImageUrl,
			wsdcid: this.Wsdcid,
			wsdcDancer:
				this.WsdcDancer === null ? null : this.WsdcDancer.toJSON(),
			attendances: this.Attendances.reduce((acc, attendance) => {
				acc.push(attendance.toJSON());
				return acc;
			}, []),
			facebookId: this.FacebookId,
			location: this.Location,
		};
		return full
			? {
					...base,
					password: this.Password,
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
		this.AccountId = data.hasOwnProperty('accountId') ? data.accountId : '';
		this.Username = data.hasOwnProperty('username') ? data.username : '';
		this.Email = data.hasOwnProperty('email') ? data.email : '';
		this.FirstName = data.hasOwnProperty('firstName') ? data.firstName : '';
		this.LastName = data.hasOwnProperty('lastName') ? data.lastName : '';
		this.ProfileImageUrl = data.hasOwnProperty('profileImageUrl')
			? data.profileImageUrl
			: '';
		this.Wsdcid = data.hasOwnProperty('wsdcid') ? data.wsdcid : '';
		this.WsdcDancer = data.hasOwnProperty('wsdcDancer')
			? new Dancer(data.wsdcDancer)
			: null;
		this.FacebookId = data.hasOwnProperty('facebookId')
			? data.facebookId
			: '';
		this.Location = data.hasOwnProperty('location') ? data.location : '';
		this.Password = data.hasOwnProperty('password')
			? bcrypt.hashSync(data.password, 10)
			: '';
		if (this.Email === '') {
			this.setError('No email on account.');
		}

		if (data.hasOwnProperty('attendances')) {
			for (let key in data.attendances) {
				this.Attendances.push(new Attendance(data.attendances[key]));
			}
		}
	}
	// TODO: Include some more processing, maybe wsdcId checking here
	processDancer(dancer) {
		this.WsdcDancer = dancer;
	}
	addAttendance(attendance) {
		// TODO: Insert attendance in order?
		for (let i = 0, len = this.Attendances.length; i < len; i++) {
			if (
				this.Attendances[i].event.eventId === attendance.event.eventId
			) {
				this.setError(
					`${attendance.event.eventId} already exists for account`
				);
				return false;
			}
		}
		this.Attendances.push(attendance);
		return true;
	}
	removeAttendance(attendance) {
		// TODO: Insert attendance in order?
		const newAttendances = this.Attendances.filter(
			(att, idx) => att.event.eventId !== attendance.event.eventId
		);
		if (this.Attendances.length !== newAttendances.length) {
			this.Attendances = newAttendances;
			return true;
		} else {
			this.setError(`${attendance.event.eventId} does not exist`);
			return false;
		}
	}
	setAttendance(attendance) {
		for (let i = 0, len = this.Attendances.length; i < len; i++) {
			if (
				this.Attendances[i].event.eventId === attendance.event.eventId
			) {
				this.Attendances[i] = attendance;
				return;
			}
		}
		this.Attendances.push(attendance);
	}
	getAttendance(eventId) {
		for (let i = 0, len = this.Attendances.length; i < len; i++) {
			if (this.Attendances[i].event.eventId === eventId) {
				return this.Attendances[i];
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
