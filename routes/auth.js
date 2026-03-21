const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../middleware/db');

// GET /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { title: 'Login — NiMSA SE' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email.toLowerCase().trim());

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
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  req.flash('success', `Welcome back, ${user.name}!`);
  if (user.role === 'admin') return res.redirect('/admin');
  res.redirect('/');
});

// GET /auth/register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  const db = readDB();
  res.render('register', { title: 'Register — NiMSA SE', settings: db.settings });
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword, institution, level } = req.body;
  
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/auth/register');
  }

  if (password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters.');
    return res.redirect('/auth/register');
  }

  const db = readDB();
  const existing = db.users.find(u => u.email === email.toLowerCase().trim());
  if (existing) {
    req.flash('error', 'An account with this email already exists.');
    return res.redirect('/auth/register');
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashed,
    role: 'user',
    institution,
    level,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  req.session.user = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };

  req.flash('success', `Welcome to NiMSA SE, ${newUser.name}!`);
  res.redirect('/');
});

// GET /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
