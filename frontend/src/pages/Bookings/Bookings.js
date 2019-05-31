import React, { Component } from 'react';
import './Bookings.css';
import AuthContext from "../../context/auth-context";
import Spinner from '../../components/Spiner/Spinner';
import BookingsList from '../../components/Bookings/BookingsList/BookingsList';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  static contextType = AuthContext;

  fetchBookings = () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            event {
              _id
              title
              date
            }
            createdAt 
            updatedAt
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
      const { bookings } = resData.data;
      this.setState({ bookings, isLoading: false });
    })
    .catch(err => {
      console.error(err);
      this.setState({ isLoading: false });
    });
  };

  cancelBooking = bookingId => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
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
      this.setState(prevState => {
        return {
          bookings: prevState.bookings.filter(b => b._id !== bookingId),
          isLoading: false
        };
      })
    })
    .catch(err => {
      console.error(err);
      this.setState({ isLoading: false });
    });
  };

  componentDidMount() {
    this.fetchBookings();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner/>}
        <BookingsList bookings={this.state.bookings}
                      onDelete={this.cancelBooking} />
      </React.Fragment>
    );
  }
}

export default BookingsPage;