import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from './api.jsx';
import FacebookLogin from 'react-facebook-login';
import Dancer from './classes/Dancers.jsx';
import FacebookApi from './classes/FacebookApi.jsx';
import configs from './config/config';

require('../views/account.html');

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
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
                userName: '',
                email: '',
                firstName: '',
                lastName: '',
                wsdcid: '',
			},
			dancers: [],
		};
		// Login status received
		FacebookApi.GetLoginStatus()
			.then(result => {
				console.log("Status result: ", result);
			})
			.catch(error => {
				console.log(error);
			});
	}
	createAccount() {
		ApiService.CreateAccount(this.state.form)
			.then(result => {
				console.log("Created: ", result);
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
			form: Object.assign({}, this.state.form, { wsdcid: $event.target.value }),
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
		// TODO: Sanitize the crap out of this!!
		this.setState({
			form: Object.assign({}, this.state.form, { 
				email: data.email,
				firstName: data.first_name,
				lastName: data.last_name,
				userName: `${data.first_name} ${data.last_name}`,
				location: data.location.name,
				facebookId: data.id
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
				<header>
					<h1>Create Account</h1>
				</header>
				<section className="content-area">
					<FacebookLogin
						appId={configs.FACEBOOK_APP_ID}
						autoLoad={true}
						fields={configs.FACEBOOK_FIELDS}
						scope={configs.FACEBOOK_SCOPES}
						callback={(e) => this.responseFacebook(e)}
						/>
					<div className="form-container">
						<label htmlFor="username">Username: </label>
						<input
							name="username"
							id="username"
							onChange={e => this.onUsernameUpdate(e)}
						/>
					</div>
                    <div className="form-container">
						<label htmlFor="email">Email: </label>
						<input
							name="email"
                            id="email"
                            type="email"
							onChange={e => this.onEmailUpdate(e)}
						/>
					</div>
					<div className="form-container">
						<label htmlFor="firstname">First Name: </label>
						<input
							name="firstname"
							name="firstname"
							onChange={e => this.onFirstnameUpdate(e)}
						/>
					</div>
					<div className="form-container">
						<label htmlFor="lastname">Last Name: </label>
						<input
							name="lastname"
							id="lastname"
							onChange={e => this.onLastnameUpdate(e)}
						/>
					</div>
					<div className="form-container">
						<label htmlFor="wsdcid">WSDC Number: </label>
						<input
							name="wsdcid"
							id="wsdcid"
							onChange={e => this.onWSDCUpdate(e)}
						/>
					</div>
					<button onClick={e => this.onCreateClicked(e)}>Create</button>
				</section>
			</main>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
