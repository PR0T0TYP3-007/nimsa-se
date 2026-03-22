const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  acronym:       { type: String, required: true },
  assoc:         { type: String, required: true },
  state:         { type: String, required: true },
  type:          { type: String, enum: ['Federal','State','Private'], default: 'State' },
  quota:         { type: Number, default: 0 },
  dental_quota:  { type: Number, default: 0 },
  status:        { type: String, default: 'Fully Accredited' },
  order:         { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);
