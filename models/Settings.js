const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  whatsappNumber:   { type: String, default: '2348000000000' },
  email:            { type: String, default: 'nimsa.se@gmail.com' },
  facebook:         { type: String, default: '#' },
  instagram:        { type: String, default: '#' },
  twitter:          { type: String, default: '#' },
  youtube:          { type: String, default: '#' },
  siteName:         { type: String, default: 'NiMSA South East Region' },
  resPastQuestions: { type: String, default: '' },
  resClinicalGuides:{ type: String, default: '' },
  resIFMSA:         { type: String, default: '' },
  resScholarships:  { type: String, default: '' },
  resResearch:      { type: String, default: '' },
  resNMAMDCN:       { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
