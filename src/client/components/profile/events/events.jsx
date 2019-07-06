import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import API from '../../../libs/api.jsx';
import { Event } from '../../../classes/Event.jsx';

require('./events.scss');
export class Events extends Component {
	static propTypes = {
		attendances: PropTypes.array,
		accountId: PropTypes.string,
	};
	constructor(props) {
		super(props);
		this.state = {
			attendances: this.props.attendances,
			events: [],
			unassignedEvents: [],
			assignedEvents: [],
			partneredEvents: [],
			pastEvents: [],
		};
		this.api = new API();
	}
	componentDidMount() {
		const attMap = this.state.attendances.reduce((acc, att) => {
			acc[att.event.eventId] = att;
			return acc;
		}, {});
		this.api
			.GetEvents()
			.then(eventsRaw => {
				this.setState({
					events: eventsRaw
						.reduce((acc, eRaw) => {
							acc.push(
								new Event({
									data: eRaw,
									attendance: attMap.hasOwnProperty(
										eRaw.eventId
									)
										? attMap[eRaw.eventId]
										: null,
								})
							);
							return acc;
						}, [])
						.sort(
							(a, b) =>
								b.startDate.getTime() - a.startDate.getTime()
						),
				});
				this.processEvents();
			})
			.catch(error => {});
	}
	processEvents() {
		// const attendingIds = this.state.attendances.reduce(
		// 	(acc, attendance) => {
		// 		acc.push(attendance.event.eventId);
		// 		return acc;
		// 	},
		// 	[]
		// );
		// const assignedEvents = [];
		// const unassignedEvents = [];
		// const pastEvents = [];
		// for (let i = 0, len = this.state.events; i < len; i++) {
		// 	const idxEvent = this.state.events[i];
		// 	if (new Date(idxEvent.startDate).getTime() < new Date().getTime()) {
		// 		pastEvents.push(idxEvent);
		// 	}
		// 	if (attendingIds.indexOf(idxEvent.eventId) === -1) {
		// 		unassignedEvents.push(idxEvent);
		// 	} else {
		// 	}
		// }
		// const currentEvents = this.state.events.filter(event => {
		// 	return new Date(event.startDate).getTime() >= new Date().getTime();
		// });
		// console.log('Current events: ', currentEvents);
		// assignedEvents = this.state.attendances.reduce((acc, attendance) => {
		// 	assignedIds.push(attendance.event.eventId);
		// 	acc.push(attendance.event);
		// 	return acc;
		// }, []);
		// const assignedIds = [];
		// this.setState({
		// 	assignedEvents,
		// 	unassignedEvents,
		// });
	}
	attendEvent(event) {
		this.api
			.attendEvent(event.eventId, this.props.accountId)
			.then(resultEvent => {
				console.log('result: ', resultEvent);
				this.setState({
					events: this.state.events.map(mEvent => {
						if (mEvent.eventId === event.eventId) {
							mEvent.attending = true;
						}
						return mEvent;
					}),
				});
			})
			.catch(error => {
				console.log('Error attending event: ', error);
			});
	}
	unAttendEvent(event) {
		this.api
			.attendEvent(event.eventId, this.props.accountId)
			.then(resultEvent => {
				console.log('result: ', resultEvent);
				this.setState({
					events: this.state.events.map(mEvent => {
						if (mEvent.eventId === event.eventId) {
							mEvent.attending = true;
						}
						return mEvent;
					}),
				});
			})
			.catch(error => {
				console.log('Error attending event: ', error);
			});
	}
	attendEventClicked(event) {
		this.attendEvent(event);
	}
	unAttendEventClicked(event) {
		console.log('Unattend clicked event: ', event);
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
									<div className="events-item-primary-action">
										{event.attending ? (
											<button
												onClick={e =>
													this.unAttendEventClicked(
														event
													)
												}
												className="add-action"
											>
												-
											</button>
										) : (
											<button
												className="add-action"
												onClick={e =>
													this.attendEventClicked(
														event
													)
												}
											>
												+
											</button>
										)}
									</div>
									<div className="events-item-main">
										<header className="events-item__header">
											<p className="header-primary">
												{event.eventName} |
											</p>
											<p>
												{event.startDate.toLocaleDateString(
													'en-US'
												)}{' '}
												-{' '}
												{event.endDate.toLocaleDateString(
													'en-US'
												)}
											</p>
										</header>
										{/* TODO: Sanitize all this data! */}
										<div className="events-item__body">
											<a href={event.eventUrl}>
												{event.eventUrl}
											</a>
											<p>{event.contactName}</p>
											<p>{event.hotelAddress}</p>
											{event.attending ? (
												<p>Attending</p>
											) : (
												''
											)}
										</div>
									</div>
									<div className="events-item-meta" />
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
