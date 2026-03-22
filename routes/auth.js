const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const Settings = require('../models/Settings');

// GET /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { title: 'Login — NiMSA SE' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id:    user._id.toString(),
      name:  user.name,
      email: user.email,
      role:  user.role
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    return user.role === 'admin' ? res.redirect('/admin') : res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// GET /auth/register
router.get('/register', async (req, res) => {
  if (req.session.user) return res.redirect('/');
  const settings = await Settings.findOne() || {};
  res.render('register', { title: 'Register — NiMSA SE', settings });
});

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, institution, level } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/register');
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/auth/register');
    }

    const hashed  = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: 'user',
      institution,
      level
    });

    req.session.user = {
      id:    newUser._id.toString(),
      name:  newUser.name,
      email: newUser.email,
      role:  newUser.role
    };

    req.flash('success', `Welcome to NiMSA SE, ${newUser.name}!`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// GET /auth/change-password
router.get('/change-password', (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first.');
    return res.redirect('/auth/login');
  }
  res.render('change-password', { title: 'Change Password — NiMSA SE' });
});

// POST /auth/change-password
router.post('/change-password', async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/auth/change-password');
    }
    if (newPassword.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/change-password');
    }

    const user = await User.findById(req.session.user.id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/auth/change-password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/auth/change-password');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/auth/change-password');
  }
});

module.exports = router;
