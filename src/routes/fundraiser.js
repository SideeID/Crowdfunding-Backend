const express = require('express');
const {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
} = require('../controllers/fundraiserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createFundraiser);
router.get('/', getAllFundraisers);
router.get('/:id', getFundraiserById);

module.exports = router;
