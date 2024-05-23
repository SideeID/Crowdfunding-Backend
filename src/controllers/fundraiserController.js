const Fundraiser = require('../model/fundraiserSchema');

const createFundraiser = async (req, res) => {
  const {
    title, description, image, isClosed, endDate, goal,
  } = req.body;
  const userId = req.user._id;

  if (!title || !description || !image || isClosed || !endDate || !goal) {
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang!' });
  }

  try {
    const fundraiser = new Fundraiser({
      title,
      description,
      goal,
      image,
      isClosed,
      endDate,
      createdBy: userId,
    });
    await fundraiser.save();

    return res.status(201).json({
      success: true,
      message: 'Penggalangan dana berhasil dibuat',
      fundraiser,
    });
  } catch (error) {
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
      .exec();
    if (!fundraiser) {
      return res
        .status(404)
        .json({ success: false, message: 'Penggalangan dana tidak ditemukan' });
    }

    return res.status(200).json({ success: true, fundraiser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

// edit fundraiser
const updateFundraiser = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, image, isClosed, endDate, goal,
  } = req.body;

  if (!title && !description && !image && !isClosed && !endDate && !goal) {
    return res.status(400).json({
      success: false,
      message: 'Harap isi setidaknya satu bidang',
    });
  }

  try {
    const fundraiser = await Fundraiser.findByIdAndUpdate(
      id,
      {
        title,
        description,
        image,
        isClosed,
        endDate,
        goal,
      },
      { new: true },
    );

    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Penggalangan dana tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Penggalangan dana berhasil diperbarui',
      fundraiser,
    });
  } catch (error) {
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
      return res.status(404).json({
        success: false,
        message: 'Penggalangan dana tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Penggalangan dana berhasil dihapus',
    });
  } catch (error) {
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