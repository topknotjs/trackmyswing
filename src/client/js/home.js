import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from './api';
require('../views/home.html');

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            dancers: []
        };
        this.api = new API();
    }
    componentWillMount(){
        this.api.GetDancers()
            .then((results) => {
                this.setState({dancers: results});
                console.log(results);
            })
            .catch((error) => {
               console.log("Api error: ", error); 
            });
    }
    render(){
        return (<main>
            <header>
                <h1>Find my Strictly</h1>
            </header>
        </main>);
    }
}

ReactDOM.render(    
    <App />,
    document.getElementById('root')
);