import React, { Component } from 'react';
import './Events.css';

import Modal from '../Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

class EventsPage extends Component {
  state = {
    creating: false
  };

  showModal = () => {
    this.setState({ creating: true });
  };

  hideModal = () => {
    this.setState({ creating: false });
  };

  createEvent = () => {

  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop/>}
        {this.state.creating &&
        <Modal title="Add Event"
               canCancel
               canConfirm
               onCancel={this.hideModal}
               onConfirm={this.createEvent}>
          <p>Modal Content</p>
        </Modal>
        }
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.showModal}>Create Event</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;