const jwt = require('jsonwebtoken');
const Userdb = require('../model/userSchema');

const { JWT_SECRET } = process.env;

const loginSuccess = async (req, res) => {
  if (req.user) {
    const user = await Userdb.findById(req.user._id);
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '3h',
    });

    return res.status(200).json({
      success: true,
      message: 'User berhasil diautentikasi',
      user,
      token,
      role: user.role,
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Waduh User belum melakukan autentikasi',
  });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('http://localhost:5173');
  });
};

module.exports = {
  loginSuccess,
  logout,
};
