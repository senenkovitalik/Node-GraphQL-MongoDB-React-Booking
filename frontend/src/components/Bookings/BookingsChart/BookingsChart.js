import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

import './BookingsChart.css';


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

const bookingsChart = ({ bookings }) => {
  const chartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingCount = bookings.reduce((prev, current) =>
        current.event.price > BOOKING_BUCKETS[bucket].min &&
        current.event.price < BOOKING_BUCKETS[bucket].max
          ? prev + 1
          : prev,
      0);
    chartData.labels.push(bucket);
    chartData.datasets[0].data.push(filteredBookingCount);
  }

  return (
    <div className='booking-chart'>
      <BarChart data={chartData}/>
    </div>
  );
};

export default bookingsChart;