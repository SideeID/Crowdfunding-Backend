const express = require('express');
const {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  updateFundraiser,
  deleteFundraiser,
} = require('../controllers/fundraiserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createFundraiser);
router.get('/', getAllFundraisers);
router.get('/:id', getFundraiserById);
router.put('/:id', authMiddleware, updateFundraiser);
router.delete('/:id', authMiddleware, deleteFundraiser);

module.exports = router;
