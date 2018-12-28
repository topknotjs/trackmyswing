import React, { Component, PropTypes } from 'react';

export default class DancerList extends Component {
	static propTypes = {
		dancers: PropTypes.string,
	};
	constructor(props) {
		super(props);
		this.state = {
			dancers: props.dancers,
		};
	}
	render() {
		return (
			<ul className="dancer-list">
				{this.state.dancers.map((dancer, index) => {
					return (
						<li className="dancer-list-item" key={index}>
							{dancer.FirstName} {dancer.LastName}
						</li>
					);
				})}
			</ul>
		);
	}
}
