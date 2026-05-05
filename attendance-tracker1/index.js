//idex.js is the entry point of the application. It is responsible for creating the server, connecting to the database, and defining the routes.
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();
const app = express();

// Start the server
app.use(cors({
  origin: ['http://localhost:3000', 
    'http://192.168.56.1:3000'], // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());

// Sync database with models
sequelize.sync()
  .then(() => console.log('Database synced successfully'))
  .catch((error) => console.log('Database sync error:', error));



app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
