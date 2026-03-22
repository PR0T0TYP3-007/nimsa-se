const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  category: { type: String, default: 'Announcement' },
  date:     { type: String, required: true },
  excerpt:  { type: String, default: '' },
  content:  { type: String, default: '' },
  image:    { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
