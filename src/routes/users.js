const express = require('express');
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  getOwnProfile,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getOwnProfile);
router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUser);

module.exports = router;
