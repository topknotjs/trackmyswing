import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

require('./me.scss');
export class Me extends Component {
	static propTypes = {
		profile: PropTypes.object,
	};
	constructor(props) {
		super(props);
		this.state = {
			profile: props.profile,
		};
	}
	componentDidMount() {
		// TODO: Change this page to be the /login page
		// TODO: Check to see if user is logged into wcsconnect, if so, redirect to profile page
		// TODO: If user is not logged in, have them log in with their username or with facebook.
		// TODO: If user logs in with facebook, have them redirect to wcsconnect where we gather their wsdcid number, then send them to the profile page
	}

	render() {
		return (
			<section className="profile-area">
				<header className="profile-area__header-row">
					<div className="profile-area__item primary">
						<img
							// TODO: create a default profile image
							className="profile-img"
							src={this.state.profile.profileImageUrl}
							alt="Profile image"
						/>
					</div>
					<div className="profile-area__item secondary">
						<p className="profile-fullname">{`${
							this.state.profile.firstName
						} ${this.state.profile.lastName}`}</p>
					</div>
				</header>
				<div className="profile-area__item">
					<p>{this.state.profile.location}</p>
				</div>
				<div className="profile-area__item">
					<p>{this.state.profile.email}</p>
				</div>
				<div className="profile-area__item">
					<p>{this.state.profile.wsdcid}</p>
				</div>
				<div className="profile-area__item">
					<p>{this.state.profile.division}</p>
					<p>{this.state.profile.points}</p>
				</div>
			</section>
		);
	}
}
