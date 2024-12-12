const bcrypt = require('bcrypt');
const Registration = require('../models/Registration');

const registerUser = async (req, res) => {
    const {
        venue, date, studentName, dob, age, school, grade, college, occupation,
        gender, maritalStatus, aadhaarNo, panNo, religion, caste, nationality,
        previousDanceEducation, guruName, examsAppeared, gharana, parentDetails,
        homeAddress, phonePrimary, phoneAlternate, email, emergencyContact, passportPhoto,
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newRegistration = new Registration({
            venue,
            date,
            studentName,
            dob,
            age,
            school,
            grade,
            college,
            occupation,
            gender,
            maritalStatus,
            aadhaarNo,
            panNo,
            religion,
            caste,
            nationality,
            previousDanceEducation,
            guruName,
            examsAppeared,
            gharana,
            parentDetails,
            homeAddress,
            phonePrimary,
            phoneAlternate,
            email,
            emergencyContact,
            passportPhoto,
            password: hashedPassword,
            image: req.body.image,
        });

        await newRegistration.save();
        res.status(201).send({ message: 'Registration successful!' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).send({ error: 'Email already registered' });
        }
        res.status(500).send({ error: 'Failed to register' });
    }
};

module.exports = { registerUser };