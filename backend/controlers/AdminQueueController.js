// controllers/AdminQueueController.js
const Queue = require('../models/queue');
const Location = require('../models/location');
const Service = require('../models/Service');

// Fungsi untuk memanggil antrean berikutnya
exports.callNextQueue = async (req, res) => {
  try {
    const { location_id, service_id } = req.params;

    // Validasi lokasi dan layanan
    const location = await Location.findById(location_id);
    const service = await Service.findById(service_id);

    if (!location || !service) {
      return res.status(404).json({ message: 'Invalid location or service.' });
    }

    // Cari antrean terdepan yang statusnya "waiting" di lokasi dan layanan yang dipilih
    const nextQueue = await Queue.findOneAndUpdate(
      { location_id, service_id, status: 'waiting' },
      { status: 'called' },
      { new: true }
    ).sort({ queue_number: 1 }); // Urutkan berdasarkan nomor antrean terkecil

    if (!nextQueue) {
      return res.status(404).json({ message: 'No waiting queue found.' });
    }

    res.status(200).json({
      message: 'Next queue called successfully',
      date:nextQueue.queue_date, kode:nextQueue.queue_code , status:nextQueue.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Fungsi untuk menyelesaikan antrean saat ini
exports.completeQueue = async (req, res) => {
  try {
    const { queue_id } = req.params;

    // Ubah status antrean menjadi "completed"
    const queue = await Queue.findByIdAndUpdate(
      queue_id,
      { status: 'completed' },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found.' });
    }

    res.status(200).json({
      message: 'Queue marked as completed',
      queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
  
// Fungsi untuk membatalkan antrean saat ini
exports.cancelQueue = async (req, res) => {
  try {
    const { queue_id } = req.params;

    // Ubah status antrean menjadi "canceled"
    const queue = await Queue.findByIdAndUpdate(
      queue_id,
      { status: 'canceled' },
      { new: true }
    );

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found.' });
    }

    res.status(200).json({
      message: 'Queue canceled successfully',
      queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Fungsi untuk mendapatkan antrean saat ini di lokasi tertentu
exports.getCurrentQueue = async (req, res) => {
  try {
    const { location_id, service_id } = req.params;

    // Ambil antrean terakhir yang statusnya "called" di lokasi dan layanan yang dipilih
    const lastCalledQueue = await Queue.findOne({
      location_id,
      service_id,
      status: 'called'
    }).sort({ queue_number: -1 }); // Urutkan secara menurun berdasarkan nomor antrean

    if (!lastCalledQueue) {
      return res.status(404).json({ message: 'No called queue found.' });
    }

    res.status(200).json({
      message: 'Last called queue fetched successfully',
      queue_date: lastCalledQueue.queue_date,
      queueCode: lastCalledQueue.queue_code,
      status: lastCalledQueue.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

