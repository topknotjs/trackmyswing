import axios from 'axios';

export default class API {
	call(url, method, data = null) {
		let config = { method, url };
		if (data !== null) {
			config.data = data;
			config.headers = {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credential': 'same-origin',
			};
			config.withCredentials = true;
		}
		return axios(config);
	}
	GetDancers(division, role, qualifies) {
		return new Promise((resolve, reject) => {
			this.call(
				`/api/dancers/${division}/${role}${
					qualifies ? '?qualifies=true' : ''
				}`,
				'GET'
			)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	CreateAccount(accountData) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/`, 'POST', accountData)
				.then(result => {
					console.log('Account create result: ', result);
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	Login(email, password, facebookId) {
		const postData = { email };
		if (facebookId) {
			postData.facebookId = facebookId;
		} else if (password) {
			postData.password = password;
		} else {
			return;
		}
		return new Promise((resolve, reject) => {
			this.call(`/api/account/login`, 'POST', postData)
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	GetLogin() {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/login`, 'GET')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	Logout() {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/logout`, 'POST')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	GetAccountById(id) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/${id}`, 'GET')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	GetAccountByEmail(email) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account?email=${email}`, 'GET')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	GetEvents() {
		return new Promise((resolve, reject) => {
			this.call(`/api/events/`, 'GET')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	attendEvent(eventId, accountId) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/attend/${eventId}/${accountId}`, 'POST')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	unattendEvent(eventId, accountId) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/unattend/${eventId}/${accountId}`, 'POST')
				.then(result => {
					resolve(result.data);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
}
