import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import API from './api.jsx';
import Dancer from './classes/Dancers.jsx';
import FacebookApi from './classes/FacebookApi.jsx';

require('../views/home.html');

const DIVISIONS = [
    {Key: 'champion', Label: 'Champions'},
    {Key: 'allstar', Label: 'All-Stars'},
    {Key: 'advanced', Label: 'Advanced'},
    {Key: 'intermediate', Label: 'Intermediate'},
    {Key: 'novice', Label: 'Novice'},
    {Key: 'newcomer', Label: 'Newcomer'}
];
const ROLES = [
    {Key: 'leader', Label: 'Leader'},
    {Key: 'follower', Label: 'Follower'},
];

const ApiService = new API();
class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            form: {
                division: '',
                role: '',
                qualifies: false,
            },
            dancers: []
        };
    }
    searchDancers(){
        let {division, role, qualifies} = this.state.form;
        ApiService.GetDancers(division, role, qualifies)
            .then((results) => {
                this.setState({dancers: results});
            })
            .catch((error) => {
                console.log("Api error: ", error); 
            });
    }
    onDivisionChange($event){
        $event.preventDefault();
        let form = this.state.form;
        this.setState({form: Object.assign({}, form, {division: $event.target.value})});
    }
    onRoleChange($event){
        $event.preventDefault();
        let form = this.state.form;
        this.setState({form: Object.assign({}, form, {role: $event.target.value})});
    }
    onQualifiesChange($event){
        let form = this.state.form;
        this.setState({form: Object.assign({}, form, {qualifies: $event.target.checked})});
    }
    onSubmitClicked(){
        this.searchDancers();
    }
    componentDidMount(){
        FacebookApi.FetchUser()
            .then((result) => {
                console.log("User in component: ", result);
            });
    }
    render(){
        return (<main>
            <header>
                <h1>Find my Strictly</h1>
            </header>
            <section className="content-area">
                <select id="division" onChange={(e) => this.onDivisionChange(e)}>
                    <option value="">Select a division...</option>
                    {DIVISIONS.map((division, index) => {
                        return (<option key={index} value={division.Key}>{division.Label}</option>);
                    })}
                </select>
                <select id="role" onChange={(e) => this.onRoleChange(e)}>
                    <option value="">Select a role...</option>
                    {ROLES.map((role, index) => {
                        return (<option key={index} value={role.Key}>{role.Label}</option>);
                    })}
                </select>
                <input name="qualifies" type="checkbox" id="qualifies" onChange={(e) => this.onQualifiesChange(e)} />
                <button onClick={() => this.onSubmitClicked()}>Submit</button>
                <ul className="dancer-list">
                    {this.state.dancers.map((dancer, index) => {
                        return (<li key={index}>{dancer.FirstName} {dancer.LastName}</li>)
                    })}
                </ul>
            </section>
        </main>);
    }
}

ReactDOM.render(    
    <App />,
    document.getElementById('root')
);