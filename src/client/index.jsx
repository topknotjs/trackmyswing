import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from './components/home/home.jsx';
import { Account } from './components/account/account.jsx';

require('./views/index.html');

class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
          <Router>
            <Switch>
                <Route path="/account" component={Account} />
                <Route path="/" component={Home} />
            </Switch>
          </Router>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
