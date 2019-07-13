import React, { Component } from 'react';
import PropTypes from 'prop-types';
require('./eventCompSelect.scss');
export default class EventCompSelect extends Component {
  static propTypes = {
    dancer: PropTypes.object,
    handleClose: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      dancer: props.dancer,
    };
  }
  onCloseClicked() {
    this.props.handleClose();
  }
  render() {
    const { dancer } = this.state;
    return (
      <section className='event-comp-select'>
        <header className='header'>
          <button
            className='close-action'
            onClick={() => this.onCloseClicked()}
          >
            X
          </button>
          <h3>{`${dancer.firstName} ${dancer.lastName}`}</h3>
        </header>
        <ul className='event-comps' />
      </section>
    );
  }
}
