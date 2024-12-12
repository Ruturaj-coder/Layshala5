const jwt = require("jsonwebtoken");
const Registration = require("../models/Registration");
const Achievement = require("../models/Achievement"); // Assuming you have an Achievement model

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    // Decode the token to get the student ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.user.id;

    // Fetch the student details from the database
    const student = await Registration.findById(studentId, "-password"); // Exclude password field

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Return all the student's profile details
    res.json({
      firstName: student.studentName.split(" ")[0], // Assuming first name is the first part of the full name
      lastName: student.studentName.split(" ")[1], // Assuming last name is the second part of the full name
      email: student.email,
      photo: student.image,
      gender: student.gender,
      maritalStatus: student.maritalStatus,
      previousDanceEducation: student.previousDanceEducation,
      guruName: student.guruName,
      phonePrimary: student.phonePrimary,
      emergencyContact: student.emergencyContact,
      // Add any other fields that you want to show on the profile
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const putStudentProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    // Decode the token to get the student ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.user.id;

    // Get the updated profile data from the request body
    const {
      firstName,
      lastName,
      photo,
      gender,
      maritalStatus,
      previousDanceEducation,
      guruName,
      phonePrimary,
      emergencyContact,
    } = req.body;

    // Find the student by ID and update their profile
    const student = await Registration.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update the student's profile fields
    student.studentName = `${firstName} ${lastName}`;
    student.image = photo || student.image; // Only update photo if provided
    student.gender = gender || student.gender;
    student.maritalStatus = maritalStatus || student.maritalStatus;
    student.previousDanceEducation = previousDanceEducation || student.previousDanceEducation;
    student.guruName = guruName || student.guruName;
    student.phonePrimary = phonePrimary || student.phonePrimary;
    student.emergencyContact = emergencyContact || student.emergencyContact;

    // Save the updated student profile to the database
    await student.save();

    // Return the updated profile details
    res.json({
      message: "Profile updated successfully",
      student: {
        firstName: student.studentName.split(" ")[0],
        lastName: student.studentName.split(" ")[1],
        email: student.email,
        photo: student.image,
        gender: student.gender,
        maritalStatus: student.maritalStatus,
        previousDanceEducation: student.previousDanceEducation,
        guruName: student.guruName,
        phonePrimary: student.phonePrimary,
        emergencyContact: student.emergencyContact,
      },
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new achievement
const addAchievement = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authorization token is missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.user.id;

    const file = req.file; // Assuming you're using multer for file uploads
    const certificateBase64 = file.buffer.toString("base64"); // Convert file buffer to Base64

    const newAchievement = new Achievement({
      studentId,
      eventName: req.body.eventName,
      eventDate: req.body.eventDate,
      rank: req.body.rank,
      certificate: certificateBase64, // Store Base64 string
    });

    await newAchievement.save();
    res.status(201).json({ message: "Achievement added successfully", achievement: newAchievement });
  } catch (error) {
    console.error("Error adding achievement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getStudentAchievements = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.user.id;

    // Fetch achievements for the logged-in student
    const achievements = await Achievement.find({ studentId });

    res.status(200).json({ achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getStudentProfile, addAchievement, getStudentAchievements, putStudentProfile };
