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
		let { division, role } = this.state.form;
		this.setState({ searchPending: true });
		ApiService.GetDancers(division, role, true)
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
	onDivisionChange(event) {
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { division: event.target.value }),
		});
	}
	onRoleChange(event) {
		let form = this.state.form;
		this.setState({
			form: Object.assign({}, form, { role: event.target.value }),
		});
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
		const getSubmitClass = isSubmitable =>
			className('form-submit', 'btn', 'btn-light', {
				'btn-primary': isSubmitable,
			});
		return (
			<main className="strictly-container">
				<section className="search-container">
					<header className="container-header">
						<h1>Find my Strictly</h1>
					</header>
					<section className="container-body">
						<div className="form-container">
							<select
								placeholder="Select"
								className="form-selector division"
								onChange={e => this.onDivisionChange(e)}
							>
								<option hidden disabled selected value>
									Select Division
								</option>
								{DIVISIONS.map((division, index) => {
									return (
										<option
											value={division.Key}
											key={index}
										>
											{division.Label}
										</option>
									);
								})}
							</select>
						</div>
						<div className="form-container">
							<select
								className="form-selector role"
								onChange={e => this.onRoleChange(e)}
							>
								<option hidden disabled selected value>
									Select Role
								</option>
								{ROLES.map((role, index) => {
									return (
										<option key={index} value={role.Key}>
											{role.Label}
										</option>
									);
								})}
							</select>
						</div>
						{/* <div className="form-container">
							<label className="form-label">Qualifies: </label>
							<div className="form-selector qualifies">
								<label className="switch">
									<input
										name="qualifies"
										type="checkbox"
										id="qualifies"
										onChange={e =>
											this.onQualifiesChange(e)
										}
									/>
									<span className="slider round" />
								</label>
							</div>
						</div> */}
						<button
							className={getSubmitClass(this.isSubmitAvailable())}
							onClick={() => this.onSubmitClicked()}
						>
							Submit
						</button>
					</section>
					<section className="container-footer">
						<a className="create-account-link" href="/create">
							Create Account
						</a>
					</section>
				</section>
				<section className="results-container">
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
