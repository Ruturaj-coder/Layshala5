const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file
const registerRoutes = require('./routes/registerRoutes');
const authRoutes = require('./routes/authRoutes'); // Add this line
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Use routes
app.use('/api/register', registerRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/student', studentRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB
mongoose
    .connect('mongodb://127.0.0.1:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
