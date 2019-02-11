import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import { Home } from './components/home/home.jsx';
import { Login } from './components/login/login.jsx';
import { Create } from './components/create/create.jsx';
import { Profile } from './components/profile/Profile.jsx';

require('./views/index.html');

class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/create" component={Create} />
					<Route path="/profile" component={Profile} />
					<Route path="/home" component={Home} />
					<Route path="/" render={() => <Redirect to="/login" />} />
				</Switch>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
