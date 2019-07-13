import React, { Component } from 'react';
import PropTypes from 'prop-types';
require('./dancerList.scss');
const defaultProfileImage = require('../../../shared/assets/images/profile-default.jpg');
export default class DancerList extends Component {
  static propTypes = {
    accountId: PropTypes.number,
    dancers: PropTypes.array,
    selectDancer: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      accountId: props.accountId,
      dancers: props.dancers,
    };
  }
  onDancerSelectClicked(dancer) {
    this.props.selectDancer(dancer);
  }
  render() {
    return (
      <ul className='dancer-list'>
        {this.state.dancers.map((dancer, index) => {
          return (
            <li className='dancer-list-item' key={index}>
              <div className='dancer-list-item__part row-image'>
                <img
                  className='dancer-image'
                  src={
                    dancer.account.profileImageUrl
                      ? dancer.account.profileImageUrl
                      : defaultProfileImage
                  }
                />
              </div>
              <div className='dancer-list-item__part row-main'>
                <p className='dancer-list-item__primary'>
                  {dancer.account.firstName} {dancer.account.lastName}
                </p>
                {/* // TODO: Create dancer object that has a method for this */}
                {dancer.account.hasOwnProperty('accountId') ? (
                  <div className='dancer-list-item__secondary'>
                    <p>Location: {dancer.account.location}</p>
                  </div>
                ) : (
                  <div className='dancer-list-item__secondary'>
                    <p>WSDC: {dancer.account.wsdcId}</p>
                  </div>
                )}
              </div>
              <div className='dancer-list-item__part row-actions'>
                {this.state.accountId !== dancer.account.accountId ? (
                  <button onClick={e => this.onDancerSelectClicked(dancer)}>
                    Request Partner
                  </button>
                ) : (
                  ''
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
