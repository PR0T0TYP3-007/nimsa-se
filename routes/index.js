const express     = require('express');
const router      = express.Router();
const Executive   = require('../models/Executive');
const Event       = require('../models/Event');
const Bulletin    = require('../models/Bulletin');
const News        = require('../models/News');
const Institution = require('../models/Institution');
const Settings    = require('../models/Settings');

// Helper — always get settings (creates default if none exist)
async function getSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

// Home
router.get('/', async (req, res) => {
  try {
    const [settings, upcomingEvents, featuredBulletin, featuredExecs, latestNews] = await Promise.all([
      getSettings(),
      Event.find({ status: 'upcoming' }).sort({ date: 1 }).limit(3),
      Bulletin.findOne({ featured: true }),
      Executive.find().sort({ order: 1 }).limit(3),
      News.find().sort({ createdAt: -1 }).limit(3)
    ]);
    res.render('index', {
      title: 'Home — NiMSA South East Region',
      upcomingEvents,
      latestBulletin: featuredBulletin,
      featuredExecs,
      latestNews,
      settings
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Home', upcomingEvents: [], latestBulletin: null, featuredExecs: [], latestNews: [], settings: {} });
  }
});

// About
router.get('/about', async (req, res) => {
  const [settings, institutions] = await Promise.all([getSettings(), Institution.find().sort({ order: 1 })]);
  res.render('about', { title: 'About Us — NiMSA South East Region', institutions, settings });
});

// Leadership
router.get('/leadership', async (req, res) => {
  const [settings, executives, institutions] = await Promise.all([
    getSettings(),
    Executive.find().sort({ order: 1, createdAt: 1 }),
    Institution.find().sort({ order: 1 })
  ]);
  res.render('leadership', { title: 'Leadership — NiMSA South East Region', executives, institutions, settings });
});

// Events
router.get('/events', async (req, res) => {
  const [settings, events] = await Promise.all([getSettings(), Event.find().sort({ date: -1 })]);
  res.render('events', { title: 'Events — NiMSA South East Region', events, settings });
});

// Bulletin
router.get('/bulletin', async (req, res) => {
  const [settings, bulletins] = await Promise.all([getSettings(), Bulletin.find().sort({ createdAt: -1 })]);
  const featured = bulletins.find(b => b.featured) || bulletins[0];
  const archive  = bulletins.filter(b => !b.featured);
  res.render('bulletin', { title: 'Monthly Bulletin — NiMSA South East Region', featured, archive, settings });
});

// Resources
router.get('/resources', async (req, res) => {
  const settings = await getSettings();
  res.render('resources', { title: 'Resources — NiMSA South East Region', settings });
});

// Gallery
router.get('/gallery', async (req, res) => {
  const settings = await getSettings();
  res.render('gallery', { title: 'Gallery — NiMSA South East Region', settings });
});

// News
router.get('/news', async (req, res) => {
  const [settings, allNews] = await Promise.all([getSettings(), News.find().sort({ createdAt: -1 })]);
  const featured = allNews.find(n => n.featured) || allNews[0];
  const rest     = allNews.filter(n => String(n._id) !== String(featured?._id));
  res.render('news', { title: 'News & Stories — NiMSA South East Region', featured, rest, settings });
});

// Campaigns
router.get('/campaigns', async (req, res) => {
  const settings = await getSettings();
  res.render('campaigns', { title: 'Campaigns & Career — NiMSA South East Region', settings });
});

// Join
router.get('/join', async (req, res) => {
  const settings = await getSettings();
  res.render('join', { title: 'Join Us — NiMSA South East Region', settings });
});

// Contact
router.get('/contact', async (req, res) => {
  const settings = await getSettings();
  res.render('contact', { title: 'Contact — NiMSA South East Region', settings });
});

module.exports = router;
