const Mitradb = require('../model/mitraSchema');

const createMitra = async (req, res) => {
  const { name, image, campaign } = req.body;

  if (!name || !image || !campaign) {
    return res.status(400).json({
      success: false,
      message: 'Harap isi semua bidang coy!',
    });
  }

  try {
    const mitra = new Mitradb({
      name,
      image,
      campaign,
    });

    await mitra.save();

    return res.status(201).json({
      success: true,
      message: 'Mitra berhasil dibuat',
      mitra,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getAllMitra = async (req, res) => {
  try {
    const mitra = await Mitradb.find();
    return res.status(200).json({
      success: true,
      mitra,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const getMitraById = async (req, res) => {
  const { id } = req.params;

  try {
    const mitra = await Mitradb.findById(id);
    return res.status(200).json({
      success: true,
      mitra,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const updateMitra = async (req, res) => {
  const { id } = req.params;
  const { name, image, campaign } = req.body;

  if (!name || !image || !campaign) {
    return res.status(400).json({
      success: false,
      message: 'Harap isi semua bidang coy!',
    });
  }

  try {
    const mitra = await Mitradb.findByIdAndUpdate(
      id,
      { name, image, campaign },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: 'Mitra berhasil diperbarui',
      mitra,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

const deleteMitra = async (req, res) => {
  const { id } = req.params;

  try {
    const mitra = await Mitradb.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: 'Mitra berhasil dihapus',
      mitra,
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
  createMitra,
  getAllMitra,
  getMitraById,
  updateMitra,
  deleteMitra,
};
