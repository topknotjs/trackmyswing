import React, { Component, PropTypes } from 'react';
import API from './../../libs/api.jsx';
import DancerList from './dancerList/dancerList.jsx';
import EventCompSelect from './eventCompSelect/eventCompSelect.jsx';
import className from 'classnames';
import Dancer from '../../classes/Dancer.jsx';

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

const getLoader = () => (
  <div className='loading-container'>
    <img className='loading' src='/images/fidget-spinner.gif' />
  </div>
);
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      accountId: null,
      form: {
        division: '',
        role: '',
        qualifies: false,
      },
      searchPending: false,
      dancers: [],
      selectedDancer: null,
    };
    this.api = new API();
  }
  componentDidMount() {
    this.api
      .getLogin()
      .then(loggedInData => {
        if (loggedInData.accountId) {
          this.setState({ loggedIn: true, accountId: loggedInData.accountId });
        } else {
          this.setState({ loggedIn: false });
        }
      })
      .catch(error => {});
  }
  selectDancer(dancer) {
    this.setState({ selectedDancer: dancer });
    // console.log('Dancer selected: ', dancer, this.state);
  }
  searchDancers() {
    let { division, role } = this.state.form;
    this.setState({ searchPending: true });
    this.api
      .GetDancers(division, role, true)
      .then(results => {
        this.setState({
          dancers: results.reduce((acc, single) => {
            acc.push(new Dancer(single));
            return acc;
          }, []),
          searchPending: false,
        });
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

  render() {
    const getSubmitClass = isSubmitable =>
      className('form-submit', 'btn', 'btn-light', {
        'btn-primary': isSubmitable,
      });
    return (
      <main className='strictly-container'>
        <section className='search-container'>
          <header className='container-header'>
            <h1>Anchor Step</h1>
          </header>
          <section className='container-body'>
            <div className='form-container'>
              <select
                placeholder='Select'
                className='form-selector division'
                onChange={e => this.onDivisionChange(e)}
              >
                <option hidden disabled selected value>
                  Select Division
                </option>
                {DIVISIONS.map((division, index) => {
                  return (
                    <option value={division.Key} key={index}>
                      {division.Label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='form-container'>
              <select
                className='form-selector role'
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
          <section className='container-footer'>
            {this.state.loggedIn ? (
              <a
                className='account-link'
                href={`/profile/${this.state.accountId}`}
              >
                Manage Profile
              </a>
            ) : (
              <a className='account-link' href='/create'>
                Create Account
              </a>
            )}
          </section>
        </section>
        <section className='results-container'>
          {this.state.searchPending ? (
            getLoader()
          ) : (
            <div className='results-container__content'>
              {this.state.selectedDancer === null ? (
                <DancerList
                  selectDancer={dancer => this.selectDancer(dancer)}
                  accountId={this.state.accountId}
                  dancers={this.state.dancers}
                />
              ) : (
                <EventCompSelect
                  handleClose={() => this.selectDancer(null)}
                  dancer={this.state.selectedDancer}
                />
              )}
            </div>
          )}
        </section>
      </main>
    );
  }
}
