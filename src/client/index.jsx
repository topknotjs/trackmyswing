import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from './components/home/home.jsx';
import { Profile } from './components/profile/profile.jsx';

require('./views/index.html');

class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/profile" component={Profile} />
					<Route path="/" component={Home} />
				</Switch>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
