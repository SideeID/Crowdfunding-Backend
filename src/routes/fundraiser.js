const express = require('express');
const { check } = require('express-validator');
const {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  updateFundraiser,
  deleteFundraiser,
} = require('../controllers/fundraiserController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', [
  check('title').notEmpty().withMessage('Judul tidak boleh kosong'),
  check('description').notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  check('goal').notEmpty().withMessage('Target tidak boleh kosong'),
  check('endDate').notEmpty().withMessage('EndDate tidak boleh kosong'),
], authMiddleware, roleMiddleware('admin'), createFundraiser);
router.get('/', getAllFundraisers);
router.get('/:id', getFundraiserById);
router.put('/:id', [
  check('title').notEmpty().withMessage('Judul tidak boleh kosong'),
  check('description').notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  check('goal').notEmpty().withMessage('Target tidak boleh kosong'),
  check('endDate').notEmpty().withMessage('EndDate tidak boleh kosong'),
], authMiddleware, roleMiddleware('admin'), updateFundraiser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFundraiser);

module.exports = router;
