const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Create Booking Route
router.post('/create', authenticateToken, async (req, res) => {
  const { vehicleId, startDate, startTime, endDate, endTime, location, totalPrice } = req.body;

  if (!vehicleId || !startDate || !startTime || !endDate || !endTime || !location || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create new booking
    const booking = new Booking({
      userId: req.userId,
      vehicleId,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      totalPrice,
      status: 'confirmed', // Assume confirmed after payment
    });
    await booking.save();

    // Update vehicle's bookings array
    await Vehicle.findByIdAndUpdate(vehicleId, {
      $push: { bookings: { startDate, endDate, location } },
    });

    res.json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;