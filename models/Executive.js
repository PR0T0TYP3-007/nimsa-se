const mongoose = require('mongoose');

const executiveSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  position: { type: String, required: true },
  category: { type: String, enum: ['coordinator', 'rec', 'school-president', 'standing-committee'], required: true },
  school:   { type: String, required: true },
  bio:      { type: String, default: '' },
  photo:    { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email:    { type: String, default: '' },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Executive', executiveSchema);
