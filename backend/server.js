const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const UserRoute = require('./routes/UserRoutes');
const ServiceRoute = require('./routes/ServiceRoute');
const LocationRoutes = require('./routes/LocationRoutes');
const QueueRoutes = require('./routes/QueueRoute');
const AdminQueueRoutes = require('./routes/AdminQueueRoutes')


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Menggunakan rute User
app.use('/api', UserRoute, LocationRoutes, QueueRoutes, ServiceRoute, AdminQueueRoutes);

// Koneksi ke MongoDB dengan async/await dan error handling
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
