import React, { Component } from 'react';
import API from '../../libs/api.jsx';
import FacebookLogin from 'react-facebook-login';
import FacebookApi from '../../classes/FacebookApi.jsx';
import configs from '../../config/config';

require('./login.scss');

const DIVISIONS = [
	{ Key: 'champion', Label: 'Champions' },
	{ Key: 'allstar', Label: 'All-Stars' },
	{ Key: 'advanced', Label: 'Advanced' },
	{ Key: 'intermediate', Label: 'Intermediate' },
	{ Key: 'novice', Label: 'Novice' },
	{ Key: 'newcomer', Label: 'Newcomer' },
];
const ROLES = [
	{ Key: 'leader', Label: 'Leader' },
	{ Key: 'follower', Label: 'Follower' },
];

const DefaultAccountData = {
	email: '',
	password: '',
};

const ApiService = new API();
export class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: Object.assign({}, DefaultAccountData),
			loggedIn: false,
		};

		// Change this page to be the /login page
		// Check to see if user is logged into wcsconnect, if so, redirect to profile page
		// If user is not logged in, have them log in with their username or with facebook.
		// If user logs in with facebook, have them redirect to wcsconnect where we gather their wscid number, then send them to the profile page

		// Login status received
		FacebookApi.GetLoginStatus()
			.then(result => {
				console.log('Status result: ', result);
				// Check to see if user is logged in with facebook
				if (result.status === 'connected') {
					this.setState({ loggedIn: true });
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	login() {
		ApiService.Login(this.state.form)
			.then(result => {
				console.log('Login: ', result);
			})
			.catch(error => {
				console.log('Api error: ', error);
			});
	}

	onEmailUpdate($event) {
		$event.preventDefault();
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { email: $event.target.value }),
		});
	}

	onPasswordUpdate($event) {
		$event.preventDefault();
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { password: $event.target.value }),
		});
	}

	onLoginClicked() {
		this.login();
	}
	/**
	 * Handle facebook stuffs
	 * @param {} data
	 */
	responseFacebook(data) {
		// TODO: Sanitize the crap out of this!!
		this.setState({
			form: Object.assign({}, this.state.form, {
				email: data.email,
				firstName: data.first_name,
				lastName: data.last_name,
				userName: `${data.first_name} ${data.last_name}`,
				location: data.location.name,
				facebookId: data.id,
				profileImageUrl: data.picture.data.url,
			}),
		});
		this.createAccount();
		console.log(data);
	}
	componentDidMount() {
		// FacebookApi.FetchUser().then(result => {
		// 	console.log('User in component: ', result);
		// });
	}
	render() {
		return (
			<main>
				<header className="header">
					<h1>Login</h1>
				</header>
				<section className="content-area">
					<div className="login-container">
						<div className="login-container-row">
							<label className="login-label" htmlFor="email">Email: </label>
							<input
								className="login-value"
								name="email"
								id="email"
								type="email"
								value={this.state.form.email}
								onChange={e => this.onEmailUpdate(e)}
							/>
						</div>
						<div className="login-container-row">
							<label className="login-label" htmlFor="password">Password: </label>
							<input
								className="login-value"
								name="password"
								id="password"
								type="password"
								value={this.state.form.password}
								onChange={e => this.onPasswordUpdate(e)}
							/>
						</div>
						<button className="login-container-action" onClick={e => this.onLoginClicked(e)}>
							Login
						</button>
					</div>
					<FacebookLogin
						appId={configs.FACEBOOK_APP_ID}
						autoLoad={true}
						fields={configs.FACEBOOK_FIELDS}
						scope={configs.FACEBOOK_SCOPES}
						cssClass="facebook-login"
						textButton=""
						size="medium"
						callback={e => this.responseFacebook(e)}
					/>
				</section>
			</main>
		);
	}
}
