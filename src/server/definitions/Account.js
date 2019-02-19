const bcrypt = require('bcrypt');

// TODO: Add error logging
// TODO: Change wscid to wsdcid
class Account {
	constructor(data) {
		this.Username = '';
		this.Email = '';
		this.FirstName = '';
		this.LastName = '';
		this.ProfileImageUrl = '';
		this.Wscid = null;
		this.FacebookId = null;
		this.Location = '';
		this.Password = '';
		this._error = false;

		if (!data) return;
		if (!this.ValidateAccount(data)) {
			return;
		}
		this.ProcessAccount(data);
	}
	toJSON(full = false) {
		const base = {
			Username: this.Username,
			Email: this.Email,
			FirstName: this.FirstName,
			LastName: this.LastName,
			ProfileImageUrl: this.ProfileImageUrl,
			Wscid: this.Wscid,
			FacebookId: this.FacebookId,
			Location: this.Location,
		};
		return full
			? {
					...base,
					Password: this.Password,
			  }
			: full;
	}
	setError(msg) {
		console.log('Account error message: ', msg);
		this._error = msg;
	}
	ProcessAccount(data) {
		this.Username = data.hasOwnProperty('userName') ? data.userName : '';
		this.Email = data.hasOwnProperty('email') ? data.email : '';
		this.FirstName = data.hasOwnProperty('firstName') ? data.firstName : '';
		this.LastName = data.hasOwnProperty('lastName') ? data.lastName : '';
		this.ProfileImageUrl = data.hasOwnProperty('profileImageUrl')
			? data.profileImageUrl
			: '';
		this.Wscid = data.hasOwnProperty('wsdcid') ? data.wsdcid : '';
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
	}
	ValidateAccount(data) {
		return true;
	}
	HasError() {
		return this._error;
	}
	Copy(data) {
		for (let key in this) {
			if (
				!this.hasOwnProperty(key) ||
				!data.hasOwnProperty(key) ||
				!data[key]
			)
				continue;
			this[key] = data[key];
		}
	}
	static AccountFromFirebase(data) {
		let newAccount = new Account();
		for (let key in this) {
			if (
				!newAccount.hasOwnProperty(key) ||
				!data.hasOwnProperty(key) ||
				!data[key]
			)
				continue;
			newAccount[key] = data[key];
		}
		return newAccount;
	}

	static CheckPasswordAgainstHashed(password, hashed) {
		return bcrypt.compareSync(password, hashed);
	}
}
module.exports = Account;
