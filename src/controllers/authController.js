const loginSuccess = (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'user berhasil diautentikasi',
      user: req.user,
    });
  }
  return res
    .status(401)
    .json({ success: false, message: 'user belum melakukan autentikasi' });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('https://your-frontend-domain.vercel.app');
  });
};

module.exports = {
  loginSuccess,
  logout,
};
