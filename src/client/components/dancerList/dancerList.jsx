import React, { Component } from 'react';
import PropTypes from 'prop-types';
require('./dancerList.scss');
const defaultProfileImage = require('../../shared/assets/images/profile-default.jpg');
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
      <ul className='dancer-list'>
        {this.state.dancers.map((dancer, index) => {
          return (
            <li className='dancer-list-item' key={index}>
              <div className='dancer-list-item__part row-image'>
                <img
                  className='dancer-image'
                  src={
                    dancer.profileImageUrl
                      ? dancer.profileImageUrl
                      : defaultProfileImage
                  }
                />
              </div>
              <div className='dancer-list-item__part row-main'>
                <p className='dancer-list-item__primary'>
                  {dancer.firstName} {dancer.lastName}
                </p>
                {/* // TODO: Create dancer object that has a method for this */}
                {dancer.hasOwnProperty('accountId') ? (
                  <div className='dancer-list-item__secondary'>
                    <p>Location: {dancer.location}</p>
                  </div>
                ) : (
                  <div className='dancer-list-item__secondary'>
                    <p>WSDC: {dancer.wsdcid}</p>
                  </div>
                )}
              </div>
              <div className='dancer-list-item__part row-actions'>
                <button>Request Partner</button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
