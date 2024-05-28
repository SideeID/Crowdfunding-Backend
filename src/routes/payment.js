/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const Fundraiser = require('../model/fundraiserSchema');

router.post('/payment-notification', async (req, res) => {
  const { order_id, status_code, transaction_status } = req.body;

  try {
    if (
      transaction_status === 'capture'
      || transaction_status === 'settlement'
    ) {
      const fundraiser = await Fundraiser.findOne({
        'donations.orderId': order_id,
      });

      if (!fundraiser) {
        return res.status(404).json({
          success: false,
          message: 'Fundraiser not found',
        });
      }

      const donation = fundraiser.donations.find((d) => d.orderId === order_id);
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donation not found',
        });
      }

      donation.status = 'completed';
      fundraiser.collectedAmount += parseInt(donation.amount, 10);
      await fundraiser.save();

      return res.status(200).json({
        success: true,
        message: 'Payment notification processed successfully',
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Invalid transaction status',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
