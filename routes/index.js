const express = require('express');
const router = express.Router();
const { readDB } = require('../middleware/db');

// Home
router.get('/', (req, res) => {
  const db = readDB();
  const upcomingEvents = db.events.filter(e => e.status === 'upcoming').slice(0, 3);
  const latestBulletin = db.bulletins.find(b => b.featured) || db.bulletins[0];
  const featuredExecs = db.executives.slice(0, 3);
  const latestNews = db.news.slice(0, 3);
  res.render('index', {
    title: 'Home — NiMSA South East Region',
    upcomingEvents, latestBulletin, featuredExecs, latestNews,
    settings: db.settings
  });
});

// About
router.get('/about', (req, res) => {
  const db = readDB();
  res.render('about', {
    title: 'About Us — NiMSA South East Region',
    institutions: db.institutions || [],
    settings: db.settings
  });
});

// Leadership
router.get('/leadership', (req, res) => {
  const db = readDB();
  res.render('leadership', {
    title: 'Leadership — NiMSA South East Region',
    executives: db.executives,
    settings: db.settings
  });
});

// Events
router.get('/events', (req, res) => {
  const db = readDB();
  res.render('events', {
    title: 'Events — NiMSA South East Region',
    events: db.events,
    settings: db.settings
  });
});

// Bulletin
router.get('/bulletin', (req, res) => {
  const db = readDB();
  const featured = db.bulletins.find(b => b.featured) || db.bulletins[0];
  const archive = db.bulletins.filter(b => !b.featured);
  res.render('bulletin', {
    title: 'Monthly Bulletin — NiMSA South East Region',
    featured, archive, settings: db.settings
  });
});

// Resources
router.get('/resources', (req, res) => {
  const db = readDB();
  res.render('resources', {
    title: 'Resources — NiMSA South East Region',
    settings: db.settings
  });
});

// Gallery
router.get('/gallery', (req, res) => {
  const db = readDB();
  res.render('gallery', {
    title: 'Gallery — NiMSA South East Region',
    settings: db.settings
  });
});

// News
router.get('/news', (req, res) => {
  const db = readDB();
  const featured = db.news.find(n => n.featured) || db.news[0];
  const rest = db.news.filter(n => !n.featured);
  res.render('news', {
    title: 'News & Stories — NiMSA South East Region',
    featured, rest, settings: db.settings
  });
});

// Campaigns
router.get('/campaigns', (req, res) => {
  const db = readDB();
  res.render('campaigns', {
    title: 'Campaigns & Career — NiMSA South East Region',
    settings: db.settings
  });
});

// Join
router.get('/join', (req, res) => {
  const db = readDB();
  res.render('join', {
    title: 'Join Us — NiMSA South East Region',
    settings: db.settings
  });
});

// Contact
router.get('/contact', (req, res) => {
  const db = readDB();
  res.render('contact', {
    title: 'Contact — NiMSA South East Region',
    settings: db.settings
  });
});

module.exports = router;
