/* eslint-disable no-shadow */
const { validationResult } = require('express-validator');
const Fundraiser = require('../model/fundraiserSchema');
const Mitra = require('../model/mitraSchema');
const logger = require('../utils/logger');

const createFundraiser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    logger.error(`Validation errors: ${JSON.stringify(error.array())}`);
    return res.status(400).json({
      success: false,
      message: error.array(),
    });
  }

  const {
    title, description, image, isClosed, endDate, goal,
  } = req.body;
  const mitraId = req.user._id;

  if (!title || !description || !image || !endDate || !goal || !mitraId) {
    logger.error('Harap isi semua bidang coy!');
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang coy!' });
  }

  try {
    const fundraiser = new Fundraiser({
      title,
      description,
      goal,
      image,
      isClosed,
      endDate,
      mitraId,
    });

    await fundraiser.save();

    await Mitra.findByIdAndUpdate(mitraId, {
      $push: { fundraisers: fundraiser._id },
    });

    logger.info(`Penggalangan dana berhasil dibuat: ${fundraiser._id}`);
    return res.status(201).json({
      success: true,
      message: 'Penggalangan dana berhasil dibuat',
      fundraiser,
    });
  } catch (error) {
    logger.error(`Error creating fundraiser: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getAllFundraisers = async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find()
      .populate('userId', 'displayName')
      .exec();
    return res.status(200).json({ success: true, fundraisers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getFundraiserById = async (req, res) => {
  const { id } = req.params;

  try {
    const fundraiser = await Fundraiser.findById(id)
      .populate('userId', 'displayName')
      .populate('donations.user', 'displayName')
      .exec();
    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Waduh Penggalangan dana tidak ditemukan',
      });
    }

    const now = new Date();
    const endDate = new Date(fundraiser.endDate);
    const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    const fundraiserWithRemainingDays = {
      ...fundraiser.toObject(),
      remainingDays: remainingDays > 0 ? remainingDays : 0,
    };

    return res.status(200).json({
      success: true,
      fundraiser: fundraiserWithRemainingDays,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

// const updateFundraiser = async (req, res) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       message: error.array(),
//     });
//   }
//   const { id } = req.params;
//   const {
//     title, description, image, isClosed, endDate, goal, mitraId,
//   } = req.body;

//   if (!title && !description && !image && !isClosed && !endDate && !goal && !mitraId) {
//     logger.error('Harap isi setidaknya satu bidang coy!');
//     return res.status(400).json({
//       success: false,
//       message: 'Harap isi setidaknya satu bidang coy!',
//     });
//   }

//   try {
//     const fundraiser = await Fundraiser.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         image,
//         isClosed,
//         endDate,
//         goal,
//         mitraId,
//       },
//       { new: true },
//     );

//     Mitra.findByIdAndUpdate(mitraId, {
//       $push: { fundraisers: fundraiser._id },
//     });

//     if (!fundraiser) {
//       return res.status(404).json({
//         success: false,
//         message: 'Waduh Penggalangan dana tidak ditemukan',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Penggalangan dana berhasil diperbarui',
//       fundraiser,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: 'Terjadi kesalahan pada server',
//       error: error.message,
//     });
//   }
// };

const updateFundraiser = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    logger.error('Validation error during fundraiser update', {
      errors: error.array(),
    });
    return res.status(400).json({
      success: false,
      message: error.array(),
    });
  }

  const { id } = req.params;
  const {
    title, description, image, isClosed, endDate, goal, mitraId,
  } = req.body;

  if (
    !title
    && !description
    && !image
    && !isClosed
    && !endDate
    && !goal
    && !mitraId
  ) {
    logger.error('Attempt to update fundraiser with no fields provided');
    return res.status(400).json({
      success: false,
      message: 'Harap isi setidaknya satu bidang coy!',
    });
  }

  try {
    const fundraiser = await Fundraiser.findByIdAndUpdate(
      id,
      {
        title, description, image, isClosed, endDate, goal, mitraId,
      },
      { new: true },
    );

    if (fundraiser) {
      await Mitra.findByIdAndUpdate(mitraId, {
        $push: { fundraisers: fundraiser._id },
      });
      logger.info('Fundraiser updated successfully', { fundraiserId: id });
    } else {
      logger.warn('Fundraiser not found', { fundraiserId: id });
      return res.status(404).json({
        success: false,
        message: 'Waduh Penggalangan dana tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Penggalangan dana berhasil diperbarui',
      fundraiser,
    });
  } catch (error) {
    logger.error('Server error during fundraiser update', {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const deleteFundraiser = async (req, res) => {
  const { id } = req.params;

  try {
    const fundraiser = await Fundraiser.findByIdAndDelete(id);
    if (!fundraiser) {
      logger.warn(`Penggalangan dana tidak ditemukan: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Waduh Penggalangan dana tidak ditemukan',
      });
    }

    logger.info(`Penggalangan dana berhasil dihapus: ${id}`);
    return res.status(200).json({
      success: true,
      message: 'Penggalangan dana berhasil dihapus',
    });
  } catch (error) {
    logger.error(`Error deleting fundraiser: ${id}, ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

module.exports = {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  updateFundraiser,
  deleteFundraiser,
};
