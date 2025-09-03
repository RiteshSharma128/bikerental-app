const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  console.log("ho", phone);

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
    );
    if (response.data.Status !== 'Success') {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    res.json({ sessionId: response.data.Details });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP and create/find user
router.post('/verify-otp', async (req, res) => {
  const { sessionId, otp, phone } = req.body;
  if (!sessionId || !otp || !phone) return res.status(400).json({ error: 'Missing data' });

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );
    if (response.data.Status !== 'Success') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    console.log("User after verification:", user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { phone: user.phone, firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete Profile (after OTP verification)
router.post('/complete-profile', async (req, res) => {
  const { phone, firstName, lastName, email } = req.body;
  console.log("Received data:", { phone, firstName, lastName, email, token: req.headers.authorization });
  if (!phone || !firstName || !email) {
    return res.status(400).json({ error: 'Missing fields', details: { phone, firstName, email } });
  }

  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { firstName, lastName, email },
      { new: true, upsert: true }
    );
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/verify-token', async(req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { phone: user.phone, firstName: user.firstName, email: user.email } });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ error: 'Invalid token' });
  }
});

module.exports = router;
