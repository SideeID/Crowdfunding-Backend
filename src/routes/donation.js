const express = require('express');
const {
  createDonation,
  handleNotification,
} = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createDonation);
router.post('/notification', handleNotification);

module.exports = router;
