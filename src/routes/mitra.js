const express = require('express');
const {
  createMitra,
  getAllMitra,
  getMitraById,
  updateMitra,
  deleteMitra,
} = require('../controllers/mitraController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), createMitra);
router.get('/', getAllMitra);
router.get('/:id', getMitraById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateMitra);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMitra);

module.exports = router;
