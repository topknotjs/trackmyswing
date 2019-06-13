import React, { Component } from 'react';
import API from '../../libs/api.jsx';
import FacebookLogin from 'react-facebook-login';
import FacebookApi from '../../classes/FacebookApi.jsx';
import configs from '../../config/config';
import { getPageFromUrl } from '../../libs/utils';

require('./profile.scss');

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
	userName: '',
	email: '',
	firstName: '',
	lastName: '',
	wsdcid: '',
	profileImageUrl: '',
};

const ApiService = new API();
export class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: Object.assign({}, DefaultAccountData),
			loggedIn: false,
			loading: true,
		};
	}
	componentDidMount() {
		// TODO: Change this page to be the /login page
		// TODO: Check to see if user is logged into wcsconnect, if so, redirect to profile page
		// TODO: If user is not logged in, have them log in with their username or with facebook.
		// TODO: If user logs in with facebook, have them redirect to wcsconnect where we gather their wsdcid number, then send them to the profile page
		this.loadProfile();
	}
	loadProfile() {
		const profileId = getPageFromUrl(this.props.location);
		this.setState({ loading: true });
		ApiService.GetAccountById(profileId)
			.then(profile => {
				this.setState({
					profile,
					loading: false,
				});
			})
			.catch(error => {
				this.props.history.push('/login');
			});
		// Figure out what to do with this data and how to use it.
		// FacebookApi.FetchUser();
	}
	logoutClicked(event) {
		event.preventDefault();
		ApiService.Logout().then(data => {
			this.props.history.push('/login');
		});
	}
	render() {
		const RenderLoading = ({ loading }) =>
			loading ? (
				<div className="loading" />
			) : (
				<section className="profile-area">
					<div className="profile-area__item">
						<label className="label">Username</label>
						<p>{`${this.state.profile.firstName} ${
							this.state.profile.lastName
						}`}</p>
					</div>
					<div className="profile-area__item">
						<label className="label">Email</label>
						<p>{this.state.profile.email}</p>
					</div>
					<div className="profile-area__item">
						<label className="label">Profile url</label>
						<img
							// TODO: create a default profile image
							src={this.state.profile.profileImageUrl}
							alt="Profile image"
						/>
					</div>
					<div className="profile-area__item">
						<label className="label">Wsdcid</label>
						<p>{this.state.profile.wsdcid}</p>
					</div>
					<div className="profile-area__item">
						<label className="label">Location</label>
						<p>{this.state.profile.location}</p>
					</div>
					<div className="profile-area__item">
						<label className="label">Facebook Id</label>
						<p>{this.state.profile.facebookId}</p>
					</div>
				</section>
			);
		return (
			<main>
				<header className="header">
					<h1>Profile</h1>
				</header>
				<a href="" onClick={e => this.logoutClicked(e)}>
					Logout
				</a>
				<RenderLoading loading={this.state.loading} />
			</main>
		);
	}
}
