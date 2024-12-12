const express = require("express");
const { getStudentProfile, addAchievement, getStudentAchievements, putStudentProfile } = require("../controllers/studentController");
const router = express.Router();
const multer = require("multer");

// Set up memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to fetch student profile (secured with token)
router.get("/profile", getStudentProfile);

router.put("/profile", putStudentProfile);

// Use multer middleware in the route
router.post("/achievements", upload.single("certificate"), addAchievement);

router.get("/achievements", getStudentAchievements);

module.exports = router;