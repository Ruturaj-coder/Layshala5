const express = require('express');
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For JWT token generation
const Registration = require('../models/Registration');

const router = express.Router();

// Route: Handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Registration.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare the hashed password with the stored password (email)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token (store user data with id and name)
        const token = jwt.sign({ user: { id: user._id, name: user.studentName } }, 'secretKey', { expiresIn: '1h' });

        // Respond with the token
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});





module.exports = router;
