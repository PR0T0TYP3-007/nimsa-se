function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
}

function requireAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Access denied. Admin privileges required.');
  res.redirect('/');
}

module.exports = { requireLogin, requireAdmin };
