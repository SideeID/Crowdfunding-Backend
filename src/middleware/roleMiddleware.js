const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (req.user && req.user.role === requiredRole) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Akses ditolak' });
};

module.exports = roleMiddleware;
