import React, { Component } from 'react';
import PropTypes from 'prop-types';
require('./dancerList.scss');

export default class DancerList extends Component {
	static propTypes = {
		dancers: PropTypes.array,
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
							<span className="dancer-list-item__part dancer-list-item__primary">
								{dancer.firstName} {dancer.lastName} |
							</span>
							<span className="dancer-list-item__part dancer-list-item__secondary">
								{dancer.wsdcid}
							</span>
						</li>
					);
				})}
			</ul>
		);
	}
}
