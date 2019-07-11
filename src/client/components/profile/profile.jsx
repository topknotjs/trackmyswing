import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Me } from './me/me.jsx';
import { Events } from './events/events.jsx';
import { Partnerships } from './partnerships/partnerships.jsx';
import classNames from 'classnames';
import API from '../../libs/api.jsx';

require('./profile.scss');

const DefaultAccountData = {
  userName: '',
  email: '',
  firstName: '',
  lastName: '',
  wsdcid: '',
  profileImageUrl: '',
};

const defaultMenuItem = 'me';
const navMenuData = [
  {
    key: 'me',
    label: 'Me',
    component: function(props) {
      return <Me profile={this.state.profile} />;
    },
  },
  {
    key: 'partnerships',
    label: 'Partnerships',
    component: function(props) {
      return (
        <Partnerships
          attendances={this.state.profile.attendances}
          accountId={this.state.profile.accountId}
        />
      );
    },
  },
  {
    key: 'events',
    label: 'Events',
    component: function(props) {
      return (
        <Events
          attendances={this.state.profile.attendances}
          accountId={this.state.profile.accountId}
        />
      );
    },
  },
  {
    key: 'settings',
    label: 'Settings',
    component: function(props) {
      return <p>Settings</p>;
    },
  },
];

const ApiService = new API();
export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: Object.assign({}, DefaultAccountData),
      loggedIn: false,
      loading: true,
      area: !props.match.params.area
        ? defaultMenuItem
        : props.match.params.area,
    };
  }
  componentDidMount() {
    // TODO: Change this page to be the /login page
    // TODO: Check to see if user is logged into wcsconnect, if so, redirect to profile page
    // TODO: If user is not logged in, have them log in with their username or with facebook.
    // TODO: If user logs in with facebook, have them redirect to wcsconnect where we gather their wsdcid number, then send them to the profile page
    this.loadProfile();
  }
  componentDidUpdate() {
    if (this.props.match.params.area !== this.state.area) {
      this.setState({ area: this.props.match.params.area });
    }
  }
  loadProfile() {
    if (!this.props.match.params.id) {
      this.props.history.push('/login');
      return;
    }
    const profileId = this.props.match.params.id;
    this.setState({ loading: true });
    ApiService.GetAccountById(profileId)
      .then(profile => {
        this.setState({
          profile,
          loading: false,
        });
      })
      .catch(error => {
        console.log('Error getting account: ', error);
        // this.props.history.push('/login');
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
  buildNavUrl(area) {
    return `/profile/${this.props.match.params.id}/${area}`;
  }
  render() {
    const RenderLoading = ({ loading }) =>
      loading ? (
        <div className='loading' />
      ) : (
        <Switch>
          {navMenuData.map((menuItem, index) => (
            <Route
              key={index}
              path={`/profile/:id/${menuItem.key}`}
              component={menuItem.component.bind(this)}
            />
          ))}
          <Route
            path={`/profile/:id`}
            render={() => (
              <Redirect
                to={`/profile/${this.props.match.params.id}/${defaultMenuItem}`}
              />
            )}
          />
        </Switch>
      );
    return (
      <main className='page-container'>
        <nav className='page-control'>
          <header className='header'>
            <h1>Home</h1>
          </header>
          <a
            className='logout-link'
            href=''
            onClick={e => this.logoutClicked(e)}
          >
            Logout
          </a>
          <a className='home-link btn btn-primary' href='/home'>
            Find a Partner
          </a>
          <ul className='page-control__navigation'>
            {navMenuData.map((menuItem, index) => (
              <li
                key={index}
                className={classNames({
                  'nav-item': true,
                  active: menuItem.key === this.state.area,
                })}
              >
                <Link to={this.buildNavUrl(menuItem.key)}>
                  {menuItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <RenderLoading loading={this.state.loading} />
      </main>
    );
  }
}
