const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// In-memory store for reset codes (email -> { code, expires })
const resetCodes = new Map();

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Backend is working' });
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  res.status(200).json(req.user);
});

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user and return JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password: check email & generate code
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    resetCodes.set(email.toLowerCase(), { code, expires });
    console.log(`[RESET CODE] Code for ${email} is ${code}`);

    res.status(200).json({ 
      message: 'Reset code generated successfully.', 
      debugCode: code 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password: verify code & update password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const lowerEmail = email.toLowerCase();
    const record = resetCodes.get(lowerEmail);

    if (!record) {
      return res.status(400).json({ message: 'No reset session active for this email.' });
    }

    if (Date.now() > record.expires) {
      resetCodes.delete(lowerEmail);
      return res.status(400).json({ message: 'Reset code has expired. Please try again.' });
    }

    if (record.code !== code.trim()) {
      return res.status(400).json({ message: 'Invalid reset code. Please try again.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear reset code
    resetCodes.delete(lowerEmail);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
