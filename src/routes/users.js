const express = require('express');
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  getOwnProfile,
  deleteUser,
  getAllUser,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', [
  check('email').isEmail().withMessage('Email tidak valid'),
  check('displayName').notEmpty().withMessage('Nama tidak boleh kosong'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
], registerUser);
router.post('/login', loginUser);

router.get('/profile', authMiddleware, getOwnProfile);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

router.get('/', getAllUser);
router.get('/:id', getUserById);

router.get(
  '/admin/dashboard',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => res.status(200).json({
    success: true,
    message: 'Admin dashboard',
  }),
);

module.exports = router;
