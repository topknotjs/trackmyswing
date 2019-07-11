import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import API from '../../../libs/api.jsx';
import { Event } from '../../../classes/Event.jsx';

require('./partnerships.scss');
export class Partnerships extends Component {
  static propTypes = {
    attendances: PropTypes.array,
    accountId: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      attendances: this.props.attendances,
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
                  attendance: attMap.hasOwnProperty(eRaw.eventId)
                    ? attMap[eRaw.eventId]
                    : null,
                })
              );
              return acc;
            }, [])
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
        });
        this.processEvents();
      })
      .catch(error => {});
  }
  processEvents() {}
  attendEvent(event) {
    this.api
      .attendEvent(event.eventId, this.props.accountId)
      .then(resultEvent => {
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
  unattendEvent(event) {
    this.api
      .unattendEvent(event.eventId, this.props.accountId)
      .then(resultEvent => {
        this.setState({
          events: this.state.events.map(mEvent => {
            if (mEvent.eventId === event.eventId) {
              mEvent.attending = false;
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
    this.unattendEvent(event);
  }
  render() {
    return (
      <section className='events-area'>
        <header className='events-area-header'>
          <h2>Partnerships</h2>
        </header>
        <section className='events-area-body'>
          <ul className='list-group primary-events' />
          <ul className='secondary-events' />
          <ul className='tertiary-events' />
        </section>
      </section>
    );
  }
}
