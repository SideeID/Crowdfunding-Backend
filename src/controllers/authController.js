const loginSuccess = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'User berhasil diautentikasi',
      user: req.user,
      token: req.user.token,
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
