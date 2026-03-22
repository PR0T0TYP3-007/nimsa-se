const express     = require('express');
const router      = express.Router();
const bcrypt      = require('bcryptjs');
const { requireAdmin } = require('../middleware/auth');
const { cloudinary, uploadExec, uploadEvent, uploadBulletin, uploadNews, uploadGallery } = require('../middleware/upload');

const User        = require('../models/User');
const Executive   = require('../models/Executive');
const Event       = require('../models/Event');
const Bulletin    = require('../models/Bulletin');
const News        = require('../models/News');
const Institution = require('../models/Institution');
const Settings    = require('../models/Settings');

// Protect all admin routes
router.use(requireAdmin);

// Helper — always get settings
async function getSettings() {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({});
  return s;
}

// Helper — delete a file from Cloudinary by its URL
async function deleteCloudinaryFile(url, resourceType = 'image') {
  if (!url || url.startsWith('/')) return; // skip empty or local paths
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud/image/upload/v123/nimsa-se/folder/filename.ext
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return;
    // public_id is everything after upload/v{version}/
    const publicIdWithExt = parts.slice(uploadIdx + 2).join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // remove extension
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
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

router.post('/executives', uploadExec.single('photoFile'), async (req, res) => {
  try {
    const { name, position, category, school, bio, whatsapp, email } = req.body;
    const count = await Executive.countDocuments();
    const photo = req.file ? req.file.path : (req.body.photo || '');
    await Executive.create({ name, position, category, school, bio, photo, whatsapp, email, order: count + 1 });
    req.flash('success', `${name} added successfully.`);
  } catch (err) {
    console.error(err);
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

router.post('/executives/:id/edit', uploadExec.single('photoFile'), async (req, res) => {
  try {
    const exec = await Executive.findById(req.params.id);
    if (!exec) { req.flash('error', 'Not found.'); return res.redirect('/admin/executives'); }
    let photo = exec.photo;
    if (req.file) {
      await deleteCloudinaryFile(exec.photo);
      photo = req.file.path;
    } else if (req.body.photo !== undefined) {
      photo = req.body.photo;
    }
    await Executive.findByIdAndUpdate(req.params.id, { ...req.body, photo });
    req.flash('success', 'Executive updated.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Update failed.');
  }
  res.redirect('/admin/executives');
});

router.post('/executives/:id/delete', async (req, res) => {
  try {
    const exec = await Executive.findById(req.params.id);
    if (exec) {
      await deleteCloudinaryFile(exec.photo);
      await exec.deleteOne();
    }
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

router.post('/events', uploadEvent.single('imageFile'), async (req, res) => {
  try {
    const { title, date, time, type, location, description, registrationLink } = req.body;
    const status = new Date(date) >= new Date() ? 'upcoming' : 'past';
    const image = req.file ? req.file.path : (req.body.image || '');
    await Event.create({ title, date, time, type, location, description, image, registrationLink, status });
    req.flash('success', 'Event added.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add event.');
  }
  res.redirect('/admin/events');
});

router.post('/events/:id/delete', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (ev) {
      await deleteCloudinaryFile(ev.image);
      await ev.deleteOne();
    }
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

router.post('/bulletin', uploadBulletin.fields([
  { name: 'coverImageFile', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, month, year, issue, summary, featured } = req.body;
    if (featured === 'on') await Bulletin.updateMany({}, { featured: false });
    const coverImage = req.files?.coverImageFile?.[0]?.path || req.body.coverImage || '';
    const pdfUrl     = req.files?.pdfFile?.[0]?.path     || req.body.pdfUrl     || '#';
    await Bulletin.create({ title, month, year, issue, coverImage, pdfUrl, summary, featured: featured === 'on' });
    req.flash('success', 'Bulletin uploaded.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add bulletin.');
  }
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
    const b = await Bulletin.findById(req.params.id);
    if (b) {
      await deleteCloudinaryFile(b.coverImage);
      await deleteCloudinaryFile(b.pdfUrl, 'raw');
      await b.deleteOne();
    }
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

router.post('/news', uploadNews.single('imageFile'), async (req, res) => {
  try {
    const { title, category, date, excerpt, content, featured } = req.body;
    if (featured === 'on') await News.updateMany({}, { featured: false });
    const image = req.file ? req.file.path : (req.body.image || '');
    await News.create({ title, category, date, excerpt, content, image, featured: featured === 'on' });
    req.flash('success', 'News post published.');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to publish post.');
  }
  res.redirect('/admin/news');
});

router.post('/news/:id/delete', async (req, res) => {
  try {
    const n = await News.findById(req.params.id);
    if (n) {
      await deleteCloudinaryFile(n.image);
      await n.deleteOne();
    }
    req.flash('success', 'Post deleted.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/news');
});

/* ════════════════════════════════
   GALLERY
════════════════════════════════ */
router.get('/gallery', async (req, res) => {
  const [settings, photos] = await Promise.all([
    getSettings(),
    require('../models/Gallery').find().sort({ createdAt: -1 })
  ]);
  res.render('admin/gallery', { title: 'Manage Gallery — Admin', photos, settings });
});

router.post('/gallery', uploadGallery.array('photos', 20), async (req, res) => {
  try {
    const GalleryModel = require('../models/Gallery');
    const { category, caption } = req.body;
    if (!req.files || req.files.length === 0) {
      req.flash('error', 'Please select at least one image.');
      return res.redirect('/admin/gallery');
    }
    const docs = req.files.map(f => ({
      url:      f.path,   // Cloudinary URL
      category: category || 'campus',
      caption:  caption  || ''
    }));
    await GalleryModel.insertMany(docs);
    req.flash('success', `${req.files.length} photo(s) uploaded to Cloudinary.`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Upload failed.');
  }
  res.redirect('/admin/gallery');
});

router.post('/gallery/:id/delete', async (req, res) => {
  try {
    const GalleryModel = require('../models/Gallery');
    const photo = await GalleryModel.findById(req.params.id);
    if (photo) {
      await deleteCloudinaryFile(photo.url);
      await photo.deleteOne();
    }
    req.flash('success', 'Photo deleted.');
  } catch { req.flash('error', 'Delete failed.'); }
  res.redirect('/admin/gallery');
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
