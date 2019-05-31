import React, { Component } from 'react';
import './Bookings.css';
import AuthContext from "../../context/auth-context";
import Spinner from '../../components/Spiner/Spinner';
import BookingsList from '../../components/Bookings/BookingsList/BookingsList';
import BookingsChart from '../../components/Bookings/BookingsChart/BookingsChart';
import BookingsControl from '../../components/Bookings/BookingsControl/BookingsControl';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
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
              price
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
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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

  changeOutputType = outputType => {
    this.setState({ outputType });
  };

  componentDidMount() {
    this.fetchBookings();
  }

  render() {
    let content = <Spinner/>;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControl changeOutputType={this.changeOutputType}
                           activeOutputType={this.state.outputType} />
          <div>
            {this.state.outputType === 'list'
              ? <BookingsList bookings={this.state.bookings}
                              onDelete={this.cancelBooking} />
              : <BookingsChart bookings={this.state.bookings} /> }
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    );
  }
}

export default BookingsPage;