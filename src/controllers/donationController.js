/* eslint-disable camelcase */
const logger = require('../utils/logger');
const Fundraiser = require('../model/fundraiserSchema');
const { createTransaction } = require('../utils/midtrans');

const createDonation = async (req, res) => {
  const { fundraiserId, amount, isAnonymous } = req.body;
  const { user } = req;

  if (!fundraiserId || !amount) {
    logger.error('Fundraiser ID dan amount harus diisi');
    return res.status(400).json({
      success: false,
      message: 'Fundraiser ID dan amount harus diisi',
    });
  }

  try {
    const fundraiser = await Fundraiser.findById(fundraiserId);
    if (!fundraiser) {
      logger.warn(`Fundraiser tidak ditemukan: ${fundraiserId}`);
      return res.status(404).json({
        success: false,
        message: 'Waduh Fundraiser tidak ditemukan',
      });
    }

    if (fundraiser.isClosed) {
      logger.warn(`Fundraiser sudah ditutup: ${fundraiserId}`);
      return res.status(400).json({
        success: false,
        message: 'Fundraiser sudah ditutup',
      });
    }

    if (fundraiser.endDate < new Date()) {
      logger.warn(`Fundraiser sudah berakhir: ${fundraiserId}`);
      return res.status(400).json({
        success: false,
        message: 'Fundraiser sudah berakhir',
      });
    }

    const orderId = `order-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    const redirectUrl = await createTransaction(orderId, amount, user);

    fundraiser.donations.push({
      user: user._id,
      amount,
      isAnonymous,
      orderId,
      status: 'pending',
    });

    await fundraiser.save();
    logger.info(
      `Transaksi donasi berhasil dibuat: orderId=${orderId}, user=${user._id}, amount=${amount}`,
    );

    return res.status(201).json({
      success: true,
      message: 'Transaksi donasi berhasil dibuat',
      data: {
        orderId,
        redirectUrl,
      },
    });
  } catch (error) {
    logger.error(`Error creating donation: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleNotification = async (req, res) => {
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
        logger.warn(`Fundraiser tidak ditemukan untuk orderId: ${order_id}`);
        return res.status(404).json({
          success: false,
          message: 'Fundraiser tidak ditemukan',
        });
      }

      const donation = fundraiser.donations.find((d) => d.orderId === order_id);
      if (!donation) {
        logger.warn(`Donasi tidak ditemukan untuk orderId: ${order_id}`);
        return res.status(404).json({
          success: false,
          message: 'Donasi tidak ditemukan',
        });
      }

      donation.status = 'completed';
      fundraiser.collectedAmount += parseInt(donation.amount, 10);
      await fundraiser.save();

      logger.info(
        `Notifikasi berhasil diproses: orderId=${order_id}, amount=${donation.amount}`,
      );

      return res.status(200).json({
        success: true,
        message: 'Notifikasi berhasil diproses',
      });
    }
    logger.warn(
      `Status transaksi tidak valid: orderId=${order_id}, status=${transaction_status}`,
    );
    return res.status(400).json({
      success: false,
      message: 'Status transaksi tidak valid',
    });
  } catch (error) {
    logger.error(`Error handling notification: ${error.message}`);
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
