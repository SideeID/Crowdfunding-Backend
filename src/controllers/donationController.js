/* eslint-disable camelcase */
const Fundraiser = require('../model/fundraiserSchema');
const { createTransaction } = require('../utils/midtrans');

const createDonation = async (req, res) => {
  const { fundraiserId, amount, isAnonymous } = req.body;
  const { user } = req;

  if (!fundraiserId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Fundraiser ID dan amount harus diisi',
    });
  }

  try {
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Fundraiser tidak ditemukan',
      });
    }

    if (fundraiser.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'Fundraiser sudah ditutup',
      });
    }

    if (fundraiser.endDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Fundraiser sudah berakhir',
      });
    }

    const orderId = `order-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const redirectUrl = await createTransaction(orderId, amount, user);

    // donasi dibuat pending
    fundraiser.donations.push({
      user: user._id,
      amount,
      isAnonymous,
      orderId,
      status: 'pending',
    });

    await fundraiser.save();

    return res.status(201).json({
      success: true,
      message: 'Transaksi donasi berhasil dibuat',
      data: {
        orderId,
        redirectUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleNotification = async (req, res) => {
  const { order_id, transaction_status, gross_amount } = req.body;

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
          message: 'Fundraiser tidak ditemukan',
        });
      }

      const donation = fundraiser.donations.find((d) => d.orderId === order_id);
      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donasi tidak ditemukan',
        });
      }

      donation.status = 'completed';
      fundraiser.collectedAmount += parseInt(gross_amount, 10);
      await fundraiser.save();

      return res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil diproses',
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Status transaksi tidak valid',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDonation,
  handleNotification,
};
