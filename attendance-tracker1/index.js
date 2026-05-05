const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();
const app = express();

// CORS - allow frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Set this on Render dashboard
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Attendance Tracker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch((error) => console.log('Database sync error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
