const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Userdb = require('../model/userSchema');

const { JWT_SECRET } = process.env;
const MAX_LOGIN_ATTEMPTS = 5;

const registerUser = async (req, res) => {
  const { displayName, email, password } = req.body;
  if (!displayName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang coy!!!' });
  }

  try {
    let user = await Userdb.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Waduh email sudah terdaftar nampaknya',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Userdb({ displayName, email, password: hashedPassword });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: 'Registrasi berhasil', user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang coy!!!' });
  }

  try {
    const user = await Userdb.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Waduh mail tidak ditemukan nih!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.loginAttempts = req.session.loginAttempts
        ? req.session.loginAttempts + 1
        : 1;
      if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        return res.status(401).json({
          success: false,
          attempts: req.session.loginAttempts,
          message:
            'Masukin password yang bener dong! gitu aja ga bisa, lihat tu tetangga sebelah udah kawin semua, lu masih aja ga bisa login, yang bener aja!',
        });
      }
      return res
        .status(400)
        .json({ success: false, message: 'Password nya salah nih' });
    }

    delete req.session.loginAttempts;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Userdb.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User berhasil ditemukan',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    displayName, email, password, image,
  } = req.body;

  if (!displayName && !email && !password && !image) {
    return res.status(400).json({
      success: false,
      message: 'Harap isi setidaknya satu bidang untuk diperbarui coy!!!',
    });
  }

  try {
    const user = await Userdb.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    if (displayName) user.displayName = displayName;
    if (email) user.email = email;
    if (image) user.image = image;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User berhasil diperbarui',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
};
