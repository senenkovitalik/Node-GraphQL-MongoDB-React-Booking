const DataLoader = require('dataloader');

const { dateToString } = require('../../utils/date');

const User = require('../../models/user');
const Event = require('../../models/event');

const eventLoader = new DataLoader(eventIds => events(eventIds));

const userLoader = new DataLoader(userIds => User.find({ _id: { $in: userIds } }));

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event._id,
    date: new Date(event._doc.date).toISOString(),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    }
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => transformEvent(event));
  } catch (err) {
    throw err
  }
};

const singleEvent = async eventId => {
  try {
    return await eventLoader.load(eventId.toString());
  } catch (err) {
    throw err;
  }
};

module.exports = {
  user, events, singleEvent, transformEvent, transformBooking
};
