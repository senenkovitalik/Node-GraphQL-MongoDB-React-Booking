import React, { Component } from 'react';
import './Events.css';

import AuthContext from '../../context/auth-context';

import Modal from '../Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';

class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.priceRef = React.createRef();
    this.dateRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  showModal = () => {
    this.setState({ creating: true });
  };

  hideModal = () => {
    this.setState({ creating: false });
  };

  createEvent = () => {
    const title = this.titleRef.current.value;
    const price = +this.priceRef.current.value;
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      title.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            price: ${price},
            date: "${date}",
            description: "${description}"
          }) {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json();
      })
      .then(resData => {
        this.hideModal();
        this.fetchEvents();
      })
      .catch(err => console.error(err))
  };

  fetchEvents() {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ events });
      })
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.fetchEvents();
  }

  render() {
    const events = this.state.events.map(event =>
      <li key={event._id} className="events__list-item">{event.title}</li>
    );

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop/>}
        {this.state.creating &&
        <Modal title="Add Event"
               canCancel
               canConfirm
               onCancel={this.hideModal}
               onConfirm={this.createEvent}>
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="input" id="title" ref={this.titleRef}/>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={this.priceRef}/>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateRef}/>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionRef}/>
            </div>
          </form>
        </Modal>
        }
        {this.context.token && <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.showModal}>Create Event</button>
        </div>}
        <ul className="events__list">
          {events}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;