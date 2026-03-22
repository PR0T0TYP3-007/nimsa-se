const mongoose = require('mongoose');

const bulletinSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  month:      { type: String, required: true },
  year:       { type: String, required: true },
  issue:      { type: String, default: '' },
  coverImage: { type: String, default: '' },
  pdfUrl:     { type: String, default: '#' },
  summary:    { type: String, default: '' },
  featured:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Bulletin', bulletinSchema);
