const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  date:             { type: String, required: true },
  time:             { type: String, default: '' },
  type:             { type: String, enum: ['Webinar','Convention','Workshop','Campaign','Seminar','Summit'], default: 'Webinar' },
  location:         { type: String, default: '' },
  description:      { type: String, default: '' },
  image:            { type: String, default: '' },
  registrationLink: { type: String, default: '#' },
  status:           { type: String, enum: ['upcoming','past'], default: 'upcoming' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
