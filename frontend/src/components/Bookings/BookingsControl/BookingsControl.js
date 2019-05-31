import React from 'react';
import './BookingsControl.css';

const bookingsControl = ({ activeOutputType, changeOutputType }) => (
  <div className="bookings-control">
    <button className={activeOutputType === 'list' ? 'active' : ''}
            onClick={changeOutputType.bind(this, 'list')}>List</button>
    <button className={activeOutputType === 'chart' ? 'active' : ''}
            onClick={changeOutputType.bind(this, 'chart')}>Chart</button>
  </div>
);

export default bookingsControl;