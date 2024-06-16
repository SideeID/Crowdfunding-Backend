/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Userdb = require('../model/userSchema');
const Fundraiser = require('../model/fundraiserSchema');

const { JWT_SECRET } = process.env;
const MAX_LOGIN_ATTEMPTS = 5;

const registerUser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: error.array(),
    });
  }

  const {
    displayName, email, password, role,
  } = req.body;

  if (!displayName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Harap isi semua bidang coy!',
    });
  }

  try {
    let user = await Userdb.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Waduh Email sudah terdaftar',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Userdb({
      displayName,
      email,
      password: hashedPassword,
      role: role || 'user',
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      user,
    });
  } catch (error) {
    console.error('Error during registration:', error);
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
    return res.status(400).json({
      success: false,
      message: 'Harap isi semua bidang coy!',
    });
  }

  try {
    const user = await Userdb.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email tidak ditemukan',
      });
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
            'Masukin passwordnya bener dong! Gitu aja ga bisa, lihat tu tetangga sebelah udah pada nikah semua, lu masih aja ga bisa login, yang bener aja!',
        });
      }
      return res
        .status(400)
        .json({ success: false, message: 'Passwordnya salah' });
    }

    delete req.session.loginAttempts;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      message:
        user.role === 'admin'
          ? 'Berhasil login sebagai admin'
          : 'Berhasil login sebagai user',
      token,
      redirectUrl: user.role === 'admin' ? 'admin/dashboard' : '/',
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
        message: 'Waduh User tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Waduh User berhasil ditemukan',
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
  const userId = req.params.id;
  const {
    displayName, email, password, image, role,
  } = req.body;

  try {
    const user = await Userdb.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Waduh User tidak ditemukan',
      });
    }

    if (!displayName && !email && !password && !image && !role) {
      return res.status(400).json({
        success: false,
        message: 'Harap isi setidaknya satu bidang coy!',
      });
    }

    if (displayName) user.displayName = displayName;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (image) user.image = image;
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profil pengguna berhasil diperbarui',
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

const getOwnProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await Userdb.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Waduh User tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profil pengguna berhasil ditemukan',
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

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Userdb.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Waduh User tidak ditemukan',
      });
    }

    await Fundraiser.updateMany(
      { 'donations.user': userId },
      { $set: { 'donations.$[elem].isAnonymous': true } },
      { arrayFilters: [{ 'elem.user': userId }] },
    );

    await Userdb.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;

  try {
    const users = await Userdb.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Userdb.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'Semua user berhasil ditemukan',
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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
  getOwnProfile,
  deleteUser,
  getAllUser,
};
