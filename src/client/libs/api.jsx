import axios from 'axios';

export default class API {
	call(url, method, data = null) {
		let config = { method, url };
		if (data !== null) {
			config.data = data;
			config.headers = {
				'Content-Type': 'application/json',
			};
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
	Login({ password, email }) {
		return new Promise((resolve, reject) => {
			this.call(`/api/account/login`, 'POST', { password, email })
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
}
