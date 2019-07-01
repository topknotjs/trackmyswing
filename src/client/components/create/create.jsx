import React, { Component } from 'react';
import API from '../../libs/api.jsx';
import FacebookLogin from 'react-facebook-login';
import FacebookApi from '../../classes/FacebookApi.jsx';
import configs from '../../config/config';

require('./create.scss');

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
const ApiService = new API();
export class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				userName: '',
				email: '',
				password: '',
				firstName: '',
				lastName: '',
				wsdcid: '',
				profileImageUrl: '',
			},
			finishAccountWithFacebook: false,
			loggedIn: false,
		};
	}

	componentDidMount() {
		// Change this page to be the /login page
		// Check to see if user is logged into wcsconnect, if so, redirect to profile page
		// If user is not logged in, have them log in with their username or with facebook.
		// If user logs in with facebook, have them redirect to wcsconnect where we gather their wsdcid number, then send them to the profile page
		// Login status received
		// FacebookApi.GetLoginStatus()
		// 	.then(result => {
		// 		console.log('Status result: ', result);
		// 		// Check to see if user is logged in with facebook
		// 		if (result.status === 'connected') {
		// 			this.setState({ loggedIn: true });
		// 		}
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});
	}

	createAccount() {
		ApiService.CreateAccount(this.state.form)
			.then(result => {
				// TODO validate this result by creating an object!
				this.props.history.push(`/profile/${result.accountId}`);
			})
			.catch(error => {
				console.log('Api error: ', error);
			});
	}

	onUsernameUpdate($event) {
		$event.preventDefault();
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { userName: $event.target.value }),
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

	onFirstnameUpdate($event) {
		$event.preventDefault();
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { firstName: $event.target.value }),
		});
	}

	onLastnameUpdate($event) {
		$event.preventDefault();
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { lastName: $event.target.value }),
		});
	}

	onWSDCUpdate($event) {
		$event.preventDefault();
		this.setState({
			form: Object.assign({}, this.state.form, {
				wsdcid: $event.target.value,
			}),
		});
	}

	onCreateClicked() {
		this.createAccount();
	}

	/**
	 * Handle facebook stuffs
	 * @param {} data
	 */
	responseFacebook(data) {
		// TODO: Sanitize this and surround it with a wrapper
		const location = data.hasOwnProperty('location')
			? data.location.name
			: '';
		const profileImageUrl = data.hasOwnProperty('picture')
			? data.picture.data.url
			: '';
		const profileEmail = data.hasOwnProperty('email') ? data.email : '';
		this.setState({
			form: Object.assign({}, this.state.form, {
				email: profileEmail,
				firstName: data.first_name,
				lastName: data.last_name,
				location: location,
				facebookId: data.id,
				profileImageUrl: profileImageUrl,
			}),
			finishAccountWithFacebook: true,
		});
	}

	componentDidMount() {
		// FacebookApi.FetchUser().then(result => {
		// 	console.log('User in component: ', result);
		// });
	}
	renderFullForm() {
		return (
			<section className="content-area full-form">
				<div className="form-container">
					<label htmlFor="username">Username: </label>
					<input
						name="username"
						id="username"
						value={this.state.form.userName}
						onChange={e => this.onUsernameUpdate(e)}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="email">Email: </label>
					<input
						name="email"
						id="email"
						type="email"
						value={this.state.form.email}
						onChange={e => this.onEmailUpdate(e)}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="password">Password: </label>
					<input
						name="password"
						id="password"
						type="password"
						value={this.state.form.password}
						onChange={e => this.onPasswordUpdate(e)}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="firstname">First Name: </label>
					<input
						name="firstname"
						id="firstname"
						value={this.state.form.firstName}
						onChange={e => this.onFirstnameUpdate(e)}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="lastname">Last Name: </label>
					<input
						name="lastname"
						id="lastname"
						value={this.state.form.lastName}
						onChange={e => this.onLastnameUpdate(e)}
					/>
				</div>
				<div className="form-container">
					<label htmlFor="wsdcid">WSDC Number: </label>
					<input
						name="wsdcid"
						id="wsdcid"
						value={this.state.form.wsdcid}
						onChange={e => this.onWSDCUpdate(e)}
					/>
				</div>
				<button onClick={e => this.onCreateClicked(e)}>Create</button>
				<hr />
				<FacebookLogin
					appId={configs.FACEBOOK_APP_ID}
					autoLoad={false}
					fields={configs.FACEBOOK_FIELDS}
					scope={configs.FACEBOOK_SCOPES}
					cssClass="facebook-login"
					textButton="Login with Facebook"
					callback={e => this.responseFacebook(e)}
				/>
			</section>
		);
	}
	renderContinueWithFacebook() {
		return (
			<section className="content-area partial-form">
				<div className="form-container">
					<label htmlFor="wsdcid">WSDC Number: </label>
					<input
						name="wsdcid"
						id="wsdcid"
						value={this.state.form.wsdcid}
						onChange={e => this.onWSDCUpdate(e)}
					/>
				</div>
				<button onClick={e => this.onCreateClicked(e)}>Create</button>
			</section>
		);
	}
	render() {
		return (
			<main>
				<header className="header">
					<h1>Create</h1>
				</header>
				{this.state.finishAccountWithFacebook
					? this.renderContinueWithFacebook()
					: this.renderFullForm()}
			</main>
		);
	}
}
