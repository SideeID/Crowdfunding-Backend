const jwt = require('jsonwebtoken');
const Userdb = require('../model/userSchema');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Waduh token tidak ditemukan, autentikasi ditolak',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Userdb.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Waduh pengguna tidak ditemukan, autentikasi ditolak',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kedaluwarsa, silakan login kembali',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Waduh token tidak valid, autentikasi ditolak',
    });
  }
};

module.exports = authMiddleware;
