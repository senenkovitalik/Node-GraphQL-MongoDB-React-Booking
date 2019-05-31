import React from 'react';
import './BookingsList.css';

const bookingsList = ({ bookings, onDelete }) => (
  <ul className="bookings">
    {bookings.map(booking =>
      <li key={booking._id} className="bookings-list__item">
        <div className="bookings-list__item-content">
          {booking.event.title} - {new Date(booking.createdAt).toLocaleString()}
        </div>
        <div className="bookings-list__item-actions">
          <button className="btn" onClick={onDelete.bind(this, booking._id)}>Cancel</button>
        </div>
      </li>)}
  </ul>
);

export default bookingsList;