const express     = require('express');
const router      = express.Router();
const bcrypt      = require('bcryptjs');
const { requireAdmin } = require('../middleware/auth');

const User        = require('../models/User');
const Executive   = require('../models/Executive');
const Event       = require('../models/Event');
const Bulletin    = require('../models/Bulletin');
const News        = require('../models/News');
const Institution = require('../models/Institution');
const Settings    = require('../models/Settings');

// Protect all admin routes
router.use(requireAdmin);

// Helper
async function getSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

/* ════════════════════════════════
   DASHBOARD
════════════════════════════════ */
router.get('/', async (req, res) => {
  try {
    const [settings, userCount, execCount, eventCount, bulletinCount, newsCount, recentUsers] = await Promise.all([
      getSettings(),
      User.countDocuments(),
      Executive.countDocuments(),
      Event.countDocuments(),
      Bulletin.countDocuments(),
      News.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard — NiMSA SE',
      stats: { users: userCount, executives: execCount, events: eventCount, bulletins: bulletinCount, news: newsCount },
      recentUsers,
      settings
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/');
  }
});

/* ════════════════════════════════
   EXECUTIVES
════════════════════════════════ */
router.get('/executives', async (req, res) => {
  const [settings, executives] = await Promise.all([getSettings(), Executive.find().sort({ order: 1, createdAt: 1 })]);
  res.render('admin/executives', { title: 'Manage Executives — Admin', executives, settings });
});

router.post('/executives', async (req, res) => {
  try {
    const { name, position, category, school, bio, photo, whatsapp, email } = req.body;
    const count = await Executive.countDocuments();
    await Executive.create({ name, position, category, school, bio, photo, whatsapp, email, order: count + 1 });
    req.flash('success', `${name} added successfully.`);
  } catch (err) {
    req.flash('error', 'Failed to add executive.');
  }
  res.redirect('/admin/executives');
});

router.get('/executives/:id/edit', async (req, res) => {
  try {
    const [settings, exec] = await Promise.all([getSettings(), Executive.findById(req.params.id)]);
    if (!exec) { req.flash('error', 'Executive not found.'); return res.redirect('/admin/executives'); }
    res.render('admin/exec-edit', { title: 'Edit Executive — Admin', exec, settings });
  } catch { req.flash('error', 'Not found.'); res.redirect('/admin/executives'); }
});

router.post('/executives/:id/edit', async (req, res) => {
  try {
    await Executive.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success', 'Executive updated.');
  } catch { req.flash('error', 'Update failed.'); }
  res.redirect('/admin/executives');
});

router.post('/executives/:id/delete', async (req, res) => {
  try {
    await Executive.findByIdAndDelete(req.params.id);
    req.flash('success', 'Executive removed.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/executives');
});

/* ════════════════════════════════
   EVENTS
════════════════════════════════ */
router.get('/events', async (req, res) => {
  const [settings, events] = await Promise.all([getSettings(), Event.find().sort({ date: -1 })]);
  res.render('admin/events', { title: 'Manage Events — Admin', events, settings });
});

router.post('/events', async (req, res) => {
  try {
    const { title, date, time, type, location, description, image, registrationLink } = req.body;
    const status = new Date(date) >= new Date() ? 'upcoming' : 'past';
    await Event.create({ title, date, time, type, location, description, image, registrationLink, status });
    req.flash('success', 'Event added.');
  } catch { req.flash('error', 'Failed to add event.'); }
  res.redirect('/admin/events');
});

router.post('/events/:id/delete', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success', 'Event deleted.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/events');
});

/* ════════════════════════════════
   BULLETINS
════════════════════════════════ */
router.get('/bulletin', async (req, res) => {
  const [settings, bulletins] = await Promise.all([getSettings(), Bulletin.find().sort({ createdAt: -1 })]);
  res.render('admin/bulletin', { title: 'Manage Bulletins — Admin', bulletins, settings });
});

router.post('/bulletin', async (req, res) => {
  try {
    const { title, month, year, issue, coverImage, pdfUrl, summary, featured } = req.body;
    if (featured === 'on') await Bulletin.updateMany({}, { featured: false });
    await Bulletin.create({ title, month, year, issue, coverImage, pdfUrl, summary, featured: featured === 'on' });
    req.flash('success', 'Bulletin uploaded.');
  } catch { req.flash('error', 'Failed to add bulletin.'); }
  res.redirect('/admin/bulletin');
});

router.post('/bulletin/:id/feature', async (req, res) => {
  try {
    await Bulletin.updateMany({}, { featured: false });
    await Bulletin.findByIdAndUpdate(req.params.id, { featured: true });
    req.flash('success', 'Bulletin set as featured.');
  } catch { req.flash('error', 'Failed.'); }
  res.redirect('/admin/bulletin');
});

router.post('/bulletin/:id/delete', async (req, res) => {
  try {
    await Bulletin.findByIdAndDelete(req.params.id);
    req.flash('success', 'Bulletin deleted.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/bulletin');
});

/* ════════════════════════════════
   NEWS
════════════════════════════════ */
router.get('/news', async (req, res) => {
  const [settings, news] = await Promise.all([getSettings(), News.find().sort({ createdAt: -1 })]);
  res.render('admin/news', { title: 'Manage News — Admin', news, settings });
});

router.post('/news', async (req, res) => {
  try {
    const { title, category, date, excerpt, content, image, featured } = req.body;
    if (featured === 'on') await News.updateMany({}, { featured: false });
    await News.create({ title, category, date, excerpt, content, image, featured: featured === 'on' });
    req.flash('success', 'News post published.');
  } catch { req.flash('error', 'Failed to publish post.'); }
  res.redirect('/admin/news');
});

router.post('/news/:id/delete', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post deleted.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/news');
});

/* ════════════════════════════════
   CHANGE PASSWORD
════════════════════════════════ */
router.get('/change-password', async (req, res) => {
  const settings = await getSettings();
  res.render('admin/change-password', { title: 'Change Password — Admin', settings });
});

router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/admin/change-password');
    }
    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/admin/change-password');
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/admin/change-password');
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/admin/change-password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/admin/change-password');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to change password.');
    res.redirect('/admin/change-password');
  }
});

/* ════════════════════════════════
   INSTITUTIONS / MSA
════════════════════════════════ */
router.get('/institutions', async (req, res) => {
  const [settings, institutions] = await Promise.all([getSettings(), Institution.find().sort({ order: 1 })]);
  res.render('admin/institutions', { title: 'Manage Member Schools — Admin', institutions, settings });
});

router.post('/institutions', async (req, res) => {
  try {
    const count = await Institution.countDocuments();
    await Institution.create({
      ...req.body,
      quota:        parseInt(req.body.quota) || 0,
      dental_quota: parseInt(req.body.dental_quota) || 0,
      order: count + 1
    });
    req.flash('success', 'Institution added.');
  } catch { req.flash('error', 'Failed to add institution.'); }
  res.redirect('/admin/institutions');
});

router.post('/institutions/:id/edit', async (req, res) => {
  try {
    await Institution.findByIdAndUpdate(req.params.id, {
      ...req.body,
      quota:        parseInt(req.body.quota) || 0,
      dental_quota: parseInt(req.body.dental_quota) || 0
    });
    req.flash('success', 'Institution updated.');
  } catch { req.flash('error', 'Update failed.'); }
  res.redirect('/admin/institutions');
});

router.post('/institutions/:id/delete', async (req, res) => {
  try {
    await Institution.findByIdAndDelete(req.params.id);
    req.flash('success', 'Institution removed.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/institutions');
});

/* ════════════════════════════════
   USERS
════════════════════════════════ */
router.get('/users', async (req, res) => {
  const [settings, users] = await Promise.all([getSettings(), User.find().sort({ createdAt: -1 })]);
  res.render('admin/users', { title: 'Manage Users — Admin', users, settings });
});

router.post('/users/:id/toggle-admin', async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) {
      req.flash('error', 'Cannot change your own role.');
      return res.redirect('/admin/users');
    }
    const u = await User.findById(req.params.id);
    if (u) {
      u.role = u.role === 'admin' ? 'user' : 'admin';
      await u.save();
      req.flash('success', `${u.name}'s role updated to ${u.role}.`);
    }
  } catch { req.flash('error', 'Failed.'); }
  res.redirect('/admin/users');
});

router.post('/users/:id/delete', async (req, res) => {
  try {
    if (req.params.id === req.session.user.id) {
      req.flash('error', 'Cannot delete your own account.');
      return res.redirect('/admin/users');
    }
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User removed.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/users');
});

/* ════════════════════════════════
   SETTINGS
════════════════════════════════ */
router.get('/settings', async (req, res) => {
  const settings = await getSettings();
  res.render('admin/settings', { title: 'Site Settings — Admin', settings });
});

router.post('/settings', async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (s) {
      Object.assign(s, req.body);
      await s.save();
    } else {
      await Settings.create(req.body);
    }
    req.flash('success', 'Settings saved.');
  } catch { req.flash('error', 'Failed to save settings.'); }
  res.redirect('/admin/settings');
});

module.exports = router;
