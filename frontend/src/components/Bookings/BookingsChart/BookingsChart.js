import React from 'react';

const BOOKING_BUCKETS = {
  'Cheap': {
    min: 0,
    max: 100
  },
  'Normal': {
    min: 101,
    max: 200
  },
  'Expensive': {
    min: 201,
    max: 10000
  }
};

const bookingsChart = ({bookings}) => {
  const output = [];
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((prev, current) =>
      current.event.price > BOOKING_BUCKETS[bucket].min &&
      current.event.price < BOOKING_BUCKETS[bucket].max
        ? prev + 1
        : prev
      , 0);
    output[bucket] = filteredBookingsCount;
  }
  console.log(output);
  return (
    <h1>Chart Component</h1>
  );
};

export default bookingsChart;