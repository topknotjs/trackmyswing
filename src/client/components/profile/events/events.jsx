import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import API from '../../../libs/api.jsx';

require('./events.scss');
export class Events extends Component {
	static propTypes = {
		attendances: PropTypes.array,
	};
	constructor(props) {
		super(props);
		this.state = {
			attendances: this.props.attendances,
			events: [],
			unassignedEvents: [],
			assignedEvents: [],
			pastEvents: [],
		};
		this.api = new API();
	}
	componentDidMount() {
		this.api
			.GetEvents()
			.then(events => {
				this.setState({ events });
				this.processEvents();
			})
			.catch(error => {});
	}
	processEvents() {
		const currentEvents = this.state.events.filter(event => {
			console.log('StartDate: ', event.startDate);
			return new Date(event.startDate).getTime() >= new Date().getTime();
		});
		console.log('Current events: ', currentEvents);
		this.setState({
			assignedEvents: this.state.attendances.reduce((acc, attendance) => {
				acc.push(attendance.event);
				return acc;
			}, []),
			unassignedEvents,
		});
	}
	render() {
		return (
			<section className="events-area">
				<header className="events-area-header">
					<h2>Events</h2>
				</header>
				<section className="events-area-body">
					<ul className="list-group primary-events">
						{this.state.events.map((event, index) => {
							return (
								<li
									className="list-group-item events-item"
									key={index}
								>
									<header className="events-item__header">
										<p className="header-primary">
											{event.eventName} |
										</p>
										<p>
											{event.startDate} - {event.endDate}
										</p>
									</header>
									{/* TODO: Sanitize all this data! */}
									<div className="events-item__body">
										<a href={event.eventUrl}>
											{event.eventUrl}
										</a>
										<p>{event.contactName}</p>
										<p>{event.hotelAddress}</p>
									</div>
								</li>
							);
						})}
					</ul>
					<ul className="secondary-events" />
					<ul className="tertiary-events" />
				</section>
			</section>
		);
	}
}
