import React, { Component, PropTypes } from 'react';
import API from './../../libs/api.jsx';
import DancerList from '../dancerList/dancerList.jsx';
import className from 'classnames';

require('./home.scss');

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

const getLoader = () => (
	<div className="loading-container">
		<img className="loading" src="/images/fidget-spinner.gif" />
	</div>
);
export class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				division: '',
				role: '',
				qualifies: false,
			},
			searchPending: false,
			dancers: [],
		};
	}
	searchDancers() {
		let { division, role, qualifies } = this.state.form;
		this.setState({ searchPending: true });
		ApiService.GetDancers(division, role, qualifies)
			.then(results => {
				this.setState({ dancers: results, searchPending: false });
			})
			.catch(error => {
				this.setState({ searchPending: false });
				console.log('Api error: ', error);
			});
	}
	isSubmitAvailable() {
		return this.state.form.division !== '' && this.state.form.role !== '';
	}
	onDivisionChange(division) {
		let form = this.state.form;
		this.setState({ form: Object.assign({}, form, { division }) });
	}
	onRoleChange(role) {
		let form = this.state.form;
		this.setState({ form: Object.assign({}, form, { role }) });
	}
	onQualifiesChange($event) {
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { qualifies: $event.target.checked }),
		});
	}
	onSubmitClicked() {
		if (!this.isSubmitAvailable()) return;
		this.searchDancers();
	}
	componentDidMount() {
		// FacebookApi.FetchUser().then(result => {
		// 	console.log('User in component: ', result);
		// });
	}
	render() {
		const getButtonClass = isActive =>
			className('form-selector__action', 'btn', 'btn-light', {
				'btn-success': isActive,
			});
		const getSubmitClass = isSubmitable =>
			className('form-submit', 'btn', 'btn-light', {
				'btn-primary': isSubmitable,
			});
		return (
			<main className="strictly-container">
				<header className="container-header">
					<h1>Find my Strictly</h1>
				</header>
				<nav className="container-menu">
					<a href="/login">Login</a>
				</nav>
				<section className="container-body">
					<div className="form-container">
						<label className="form-label">Division</label>
						<div className="form-selector division">
							{DIVISIONS.map((division, index) => {
								return (
									<button
										className={getButtonClass(
											division.Key ===
												this.state.form.division
										)}
										onClick={e =>
											this.onDivisionChange(division.Key)
										}
										key={index}
									>
										{division.Label}
									</button>
								);
							})}
						</div>
					</div>
					<div className="form-container">
						<label className="form-label">Role</label>
						<div className="form-selector role">
							{ROLES.map((role, index) => {
								return (
									<button
										className={getButtonClass(
											role.Key === this.state.form.role
										)}
										onClick={e =>
											this.onRoleChange(role.Key)
										}
										key={index}
									>
										{role.Label}
									</button>
								);
							})}
						</div>
					</div>
					<div className="form-container parallel">
						<label className="form-label">Qualifies: </label>
						<div className="form-selector qualifies">
							<label className="switch">
								<input
									name="qualifies"
									type="checkbox"
									id="qualifies"
									onChange={e => this.onQualifiesChange(e)}
								/>
								<span className="slider round" />
							</label>
						</div>
					</div>
					<button
						className={getSubmitClass(this.isSubmitAvailable())}
						onClick={() => this.onSubmitClicked()}
					>
						Submit
					</button>
					{this.state.searchPending ? (
						getLoader()
					) : (
						<DancerList dancers={this.state.dancers} />
					)}
				</section>
			</main>
		);
	}
}
