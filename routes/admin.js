const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../middleware/db');
const { requireAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(requireAdmin);

// Dashboard
router.get('/', (req, res) => {
  const db = readDB();
  res.render('admin/dashboard', {
    title: 'Admin Dashboard — NiMSA SE',
    stats: {
      users: db.users.length,
      executives: db.executives.length,
      events: db.events.length,
      bulletins: db.bulletins.length,
      news: db.news.length
    },
    recentUsers: db.users.slice(-5).reverse(),
    settings: db.settings
  });
});

/* ── EXECUTIVES ── */
router.get('/executives', (req, res) => {
  const db = readDB();
  res.render('admin/executives', {
    title: 'Manage Executives — Admin',
    executives: db.executives,
    settings: db.settings
  });
});

router.post('/executives', (req, res) => {
  const db = readDB();
  const { name, position, category, school, bio, photo, whatsapp, email } = req.body;
  db.executives.push({ id: uuidv4(), name, position, category, school, bio, photo: photo || '', whatsapp: whatsapp || '', email: email || '' });
  writeDB(db);
  req.flash('success', 'Executive added successfully.');
  res.redirect('/admin/executives');
});

router.get('/executives/:id/edit', (req, res) => {
  const db = readDB();
  const exec = db.executives.find(e => e.id === req.params.id);
  if (!exec) { req.flash('error', 'Executive not found.'); return res.redirect('/admin/executives'); }
  res.render('admin/exec-edit', { title: 'Edit Executive — Admin', exec, settings: db.settings });
});

router.post('/executives/:id/edit', (req, res) => {
  const db = readDB();
  const idx = db.executives.findIndex(e => e.id === req.params.id);
  if (idx === -1) { req.flash('error', 'Not found.'); return res.redirect('/admin/executives'); }
  db.executives[idx] = { ...db.executives[idx], ...req.body };
  writeDB(db);
  req.flash('success', 'Executive updated.');
  res.redirect('/admin/executives');
});

router.post('/executives/:id/delete', (req, res) => {
  const db = readDB();
  db.executives = db.executives.filter(e => e.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'Executive removed.');
  res.redirect('/admin/executives');
});

/* ── EVENTS ── */
router.get('/events', (req, res) => {
  const db = readDB();
  res.render('admin/events', {
    title: 'Manage Events — Admin',
    events: db.events,
    settings: db.settings
  });
});

router.post('/events', (req, res) => {
  const db = readDB();
  const { title, date, time, type, location, description, image, registrationLink } = req.body;
  const eventDate = new Date(date);
  const status = eventDate >= new Date() ? 'upcoming' : 'past';
  db.events.push({ id: uuidv4(), title, date, time, type, location, description, image: image || '', registrationLink: registrationLink || '#', status });
  writeDB(db);
  req.flash('success', 'Event added successfully.');
  res.redirect('/admin/events');
});

router.post('/events/:id/delete', (req, res) => {
  const db = readDB();
  db.events = db.events.filter(e => e.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'Event deleted.');
  res.redirect('/admin/events');
});

/* ── BULLETINS ── */
router.get('/bulletin', (req, res) => {
  const db = readDB();
  res.render('admin/bulletin', {
    title: 'Manage Bulletins — Admin',
    bulletins: db.bulletins,
    settings: db.settings
  });
});

router.post('/bulletin', (req, res) => {
  const db = readDB();
  const { title, month, year, issue, coverImage, pdfUrl, summary, featured } = req.body;
  if (featured === 'on') {
    db.bulletins.forEach(b => b.featured = false);
  }
  db.bulletins.unshift({
    id: uuidv4(),
    title, month, year, issue,
    coverImage: coverImage || '',
    pdfUrl: pdfUrl || '#',
    summary,
    featured: featured === 'on'
  });
  writeDB(db);
  req.flash('success', 'Bulletin added.');
  res.redirect('/admin/bulletin');
});

router.post('/bulletin/:id/feature', (req, res) => {
  const db = readDB();
  db.bulletins.forEach(b => b.featured = (b.id === req.params.id));
  writeDB(db);
  req.flash('success', 'Bulletin set as featured.');
  res.redirect('/admin/bulletin');
});

router.post('/bulletin/:id/delete', (req, res) => {
  const db = readDB();
  db.bulletins = db.bulletins.filter(b => b.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'Bulletin deleted.');
  res.redirect('/admin/bulletin');
});

/* ── NEWS ── */
router.get('/news', (req, res) => {
  const db = readDB();
  res.render('admin/news', {
    title: 'Manage News — Admin',
    news: db.news,
    settings: db.settings
  });
});

router.post('/news', (req, res) => {
  const db = readDB();
  const { title, category, date, excerpt, content, image, featured } = req.body;
  if (featured === 'on') db.news.forEach(n => n.featured = false);
  db.news.unshift({ id: uuidv4(), title, category, date, excerpt, content, image: image || '', featured: featured === 'on' });
  writeDB(db);
  req.flash('success', 'News post added.');
  res.redirect('/admin/news');
});

router.post('/news/:id/delete', (req, res) => {
  const db = readDB();
  db.news = db.news.filter(n => n.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'News post deleted.');
  res.redirect('/admin/news');
});

/* ── USERS ── */
router.get('/users', (req, res) => {
  const db = readDB();
  res.render('admin/users', {
    title: 'Manage Users — Admin',
    users: db.users,
    settings: db.settings
  });
});

router.post('/users/:id/toggle-admin', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.params.id);
  if (user && user.id !== req.session.user.id) {
    user.role = user.role === 'admin' ? 'user' : 'admin';
    writeDB(db);
    req.flash('success', `${user.name}'s role updated to ${user.role}.`);
  }
  res.redirect('/admin/users');
});

router.post('/users/:id/delete', (req, res) => {
  const db = readDB();
  if (req.params.id === req.session.user.id) {
    req.flash('error', 'Cannot delete your own account.');
    return res.redirect('/admin/users');
  }
  db.users = db.users.filter(u => u.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'User removed.');
  res.redirect('/admin/users');
});

/* ── INSTITUTIONS / MSA ── */
router.get('/institutions', (req, res) => {
  const db = readDB();
  res.render('admin/institutions', {
    title: 'Manage Member Schools — Admin',
    institutions: db.institutions || [],
    settings: db.settings
  });
});

router.post('/institutions', (req, res) => {
  const db = readDB();
  if (!db.institutions) db.institutions = [];
  const { name, acronym, assoc, state, type, quota, dental_quota, status } = req.body;
  db.institutions.push({
    id: uuidv4(),
    name, acronym, assoc, state, type,
    quota: parseInt(quota) || 0,
    dental_quota: parseInt(dental_quota) || 0,
    status
  });
  writeDB(db);
  req.flash('success', 'Institution added.');
  res.redirect('/admin/institutions');
});

router.post('/institutions/:id/edit', (req, res) => {
  const db = readDB();
  const idx = (db.institutions || []).findIndex(i => i.id === req.params.id);
  if (idx !== -1) {
    db.institutions[idx] = {
      ...db.institutions[idx],
      ...req.body,
      quota: parseInt(req.body.quota) || 0,
      dental_quota: parseInt(req.body.dental_quota) || 0
    };
    writeDB(db);
    req.flash('success', 'Institution updated.');
  }
  res.redirect('/admin/institutions');
});

router.post('/institutions/:id/delete', (req, res) => {
  const db = readDB();
  db.institutions = (db.institutions || []).filter(i => i.id !== req.params.id);
  writeDB(db);
  req.flash('success', 'Institution removed.');
  res.redirect('/admin/institutions');
});

/* ── SETTINGS ── */
router.get('/settings', (req, res) => {
  const db = readDB();
  res.render('admin/settings', {
    title: 'Site Settings — Admin',
    settings: db.settings
  });
});

router.post('/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  req.flash('success', 'Settings updated.');
  res.redirect('/admin/settings');
});

module.exports = router;
