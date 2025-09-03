const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vehiclesData = require('./vehicles');
const bookingRoutes = require('./routes/bookings');
const Booking = require('./models/Booking'); // Import Booking model

dotenv.config();

const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Vehicle Schema and Model
const Vehicle = require('./models/Vehicle');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// New Search Route
app.post('/api/vehicles/search', async (req, res) => {
  const { startDate, endDate, startTime, endTime } = req.body;

  console.log("Request data:", req.body); // Log the full request body for debugging

  if (!startDate || !endDate || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Combine date and time into full datetime objects
    const dayjs = require('dayjs');
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat);

    const startDateTime = dayjs(`${startDate} ${startTime}`, 'YYYY-MM-DD hh:mm A').toDate();
    const endDateTime = dayjs(`${endDate} ${endTime}`, 'YYYY-MM-DD hh:mm A').toDate();

    if (endDateTime <= startDateTime) {
      return res.status(400).json({ error: 'End datetime must be after start datetime' });
    }

    // Calculate duration
    const durationMs = endDateTime - startDateTime;
    const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const remainingMs = durationMs % (1000 * 60 * 60 * 24);
    const durationHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    // Find all vehicles
    const allVehicles = await Vehicle.find();

    // Fetch all bookings to check availability
    const bookings = await Booking.find({
      startDate: { $lt: endDateTime },
      endDate: { $gt: startDateTime },
    });

    // Process vehicles with availability per location
    const results = allVehicles.map(vehicle => {
      const totalDays = durationDays + (durationHours / 24) + (durationMinutes / (24 * 60)); // Fractional days
      const totalPrice = Math.ceil(totalDays * vehicle.pricePerDay);
      const totalIncludedKm = Math.ceil(totalDays * vehicle.includedKm);

      // Check availability for each location
      const availability = vehicle.locations.reduce((acc, location) => {
        const isBooked = bookings.some(booking =>
          booking.vehicleId.toString() === vehicle._id.toString() &&
          booking.location === location &&
          booking.startDate < endDateTime &&
          booking.endDate > startDateTime
        );
        acc[location] = !isBooked; // true if available, false if booked
        return acc;
      }, {});

      return {
        ...vehicle.toObject(),
        calculatedPrice: totalPrice,
        calculatedIncludedKm: totalIncludedKm,
        duration: `${durationDays} Days, ${durationHours} Hours, ${durationMinutes} Minutes`,
        availability, // Add availability status per location
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Seed data function with deduplication
const seedVehicles = async () => {
  try {
    const collection = mongoose.connection.collection('vehicles');

    // Check for existing vehicles based on 'number' field
    const existingVehicles = await collection.distinct('number');
    const newVehicles = vehiclesData.filter(vehicle => !existingVehicles.includes(vehicle.number));

    if (newVehicles.length > 0) {
      const result = await Vehicle.insertMany(newVehicles, { ordered: false });
      console.log(`Vehicles seeded successfully: ${result.length} new vehicles added`);
    } else {
      console.log('No new vehicles to seed; all data already exists');
    }
  } catch (err) {
    if (err.code === 11000) {
      console.log('Duplicate key error encountered, skipping duplicates');
    } else {
      console.error('Error seeding vehicles:', err);
    }
  }
};

// Call the seed function when the server starts
seedVehicles();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
