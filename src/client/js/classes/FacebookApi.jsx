import configs from '../config/config';
class FacebookApi {
	init() {
		return new Promise((resolve, reject) => {
			if (typeof FB !== 'undefined') {
				resolve();
			} else {
				window.fbAsyncInit = function() {
					FB.init({
						appId: configs.FACEBOOK_APP_ID,
						cookie: true,
						xfbml: true,
						version: configs.FACEBOOK_VERSION,
					});
					resolve();
				};
				(function(d, s, id) {
					var js,
						fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) {
						return;
					}
					js = d.createElement(s);
					js.id = id;
					js.src = 'https://connect.facebook.net/en_US/sdk.js';
					fjs.parentNode.insertBefore(js, fjs);
				})(document, 'script', 'facebook-jssdk');
			}
		});
	}
	checkLoginState() {
		return new Promise((resolve, reject) => {
			FB.getLoginStatus(response => {
				if (response.status === 'connected') {
					resolve(response);
				} else {
					this.login()
						.then(loginResponse => {
							console.log('LoginResponse: ', loginResponse);
							resolve(loginResponse);
						})
						.catch(error => {
							console.log('Login error: ', error);
							reject(error);
						});
				}
			});
		});
	}
	login() {
		return new Promise((resolve, reject) => {
			FB.login(response => {
				response.status === 'connected'
					? resolve(response)
					: reject(response);
			});
		});
	}
	logout() {
		return new Promise((resolve, reject) => {
			FB.logout(response => {
				response.authResponse ? resolve(response) : reject(response);
			});
		});
	}
	fetch() {
		return new Promise((resolve, reject) => {
			FB.api(
				'/me/friends',
				{ fields: 'first_name, last_name, gender, picture' },
				response =>
					response.error ? reject(response) : resolve(response)
			);
		});
	}
	static FetchUser() {
		let api = new FacebookApi();
		return new Promise((resolve, reject) => {
			api.init()
				.then(result => {
					return api.checkLoginState();
				})
				.then(result => {
					return api.fetch();
				})
				.then(result => {
					console.log('Me: ', result);
					resolve(result);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
	static GetLoginStatus() {
		let api = new FacebookApi();
		return new Promise((resolve, reject) => {
			api.init()
				.then(result => {
					return api.checkLoginState();
				})
				.then(result => {
					resolve(result);
				})
				.catch(error => {
					reject(error);
				});
		});
	}
}

export default FacebookApi;
