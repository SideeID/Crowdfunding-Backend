const express = require('express');
const path = require('path');
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

router.post('/', authMiddleware, roleMiddleware('admin'), createFundraiser);
router.get('/', getAllFundraisers);
router.get('/:id', getFundraiserById);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFundraiser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFundraiser);

// Rute untuk melayani halaman fundraiser.html
router.get('/details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/fundraiser.html'));
});

module.exports = router;
