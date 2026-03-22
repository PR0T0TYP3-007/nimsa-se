const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url:      { type: String, required: true },
  category: { type: String, enum: ['convention','webinar','campaign','campus','outreach','all'], default: 'campus' },
  caption:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
