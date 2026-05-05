const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Check-in route
router.post('/checkin', protect, async (req, res) => {
  const userId = req.user.id; // Use ID from token
  try {
    // Check if user is already checked in
    const activeSession = await Attendance.findOne({
      where: { user_id: userId, check_out: null }
    });

    if (activeSession) {
      return res.status(400).json({ message: 'You are already checked in. Please check out first.' });
    }

    const attendance = await Attendance.create({ user_id: userId });
    res.status(201).json({ message: 'Check-in successful', attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-out route
router.post('/checkout', protect, async (req, res) => {
  const userId = req.user.id; // Use ID from token
  try {
    const attendance = await Attendance.findOne({
      where: { user_id: userId, check_out: null },
      order: [['check_in', 'DESC']],
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No active check-in found.' });
    }

    attendance.check_out = new Date();
    await attendance.save();
    res.status(200).json({ message: 'Check-out successful', attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance history for current user
router.get('/history', protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const attendanceHistory = await Attendance.findAll({
      where: { user_id: userId },
      include: { model: User, attributes: ['name', 'email'] },
      order: [['check_in', 'DESC']],
    });
    res.status(200).json({ history: attendanceHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all attendance records
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const records = await Attendance.findAll({
      include: { model: User, attributes: ['name', 'email', 'role'] },
      order: [['check_in', 'DESC']],
    });
    res.status(200).json({ records });
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch all attendance records' });
  }
});

module.exports = router;
