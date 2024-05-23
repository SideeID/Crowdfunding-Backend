const express = require('express');
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

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getOwnProfile);
router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/', getAllUser);

module.exports = router;
