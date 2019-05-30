import React, { Component } from 'react';
import './Events.css';

import AuthContext from '../../context/auth-context';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import EventList from '../../components/Events/EventList/EventList';
import Spinner from '../../components/Spiner/Spinner';

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
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  static contextType = AuthContext;

  showModal = () => {
    this.setState({ creating: true });
  };

  hideModal = () => {
    this.setState({
      creating: false,
      selectedEvent: null
    });
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
        this.setState(prevState => {
          const existedEvents = [...prevState.events];
          existedEvents.push({
            _id: resData.data.createEvent._id,
            title,
            description,
            price,
            date,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: existedEvents };
        });
      })
      .catch(err => console.error(err))
  };

  fetchEvents() {
    this.setState({ isLoading: true });

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
        this.setState({ events, isLoading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isLoading: false });
      });
  }

  bookEvent = () => {

  };

  showDetailModal = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  componentDidMount() {
    this.fetchEvents();
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop/>}

        {this.state.creating &&
        <Modal title="Add Event"
               canCancel
               canConfirm
               onCancel={this.hideModal}
               onConfirm={this.createEvent}
               confirmText="Confirm">
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

        {this.state.selectedEvent &&
        <Modal title={this.state.selectedEvent.title}
               canCancel
               canConfirm
               onCancel={this.hideModal}
               onConfirm={this.bookEvent}
               confirmText="Book">
          <h1>{this.state.selectedEvent.title}</h1>
          <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleString()}</h2>
          <p>{this.state.selectedEvent.description}</p>
        </Modal>}

        {this.context.token && <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.showModal}>Create Event</button>
        </div>}

        {this.state.isLoading
          ? <Spinner/>
          : <EventList events={this.state.events}
                       authUserId={this.context.userId}
                       onViewDetail={this.showDetailModal}/>}
      </React.Fragment>
    );
  }
}

export default EventsPage;