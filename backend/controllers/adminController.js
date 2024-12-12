const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check if the password matches
    if (password !== admin.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token as response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { adminLogin };
