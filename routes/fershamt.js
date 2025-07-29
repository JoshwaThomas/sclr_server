const express = require('express');
const router = express.Router();
const AmountModel = require('../models/amt');
const DonarModel = require('../models/donar');
const AcademicModel = require('../models/academic');

// ----------------------------------------------------------------------------------------------------------------

const ApplicantModel = require('../models/fersh'); // This must be correct

router.get("/freshamt", async (req, res) => {
    try {
        const activeAcademicYear = await AcademicModel.findOne({ active: '1' });
        if (!activeAcademicYear) return res.status(404).json({ message: "Active academic year not found" });
        const users = await AmountModel.find({ acyear: activeAcademicYear.acyear });
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const applicant = await ApplicantModel.findOne(
                { registerNo: user.registerNo }, { procategory: 1, _id: 0 }
            )
            return { ...user.toObject(), procategory: applicant?.procategory || null }
        }))
        res.json(enrichedUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// ----------------------------------------------------------------------------------------------------------------

router.get("/donors", async (req, res) => {
    try {
        const activeAcademicYear = await AcademicModel.findOne({ active: '1' });
        if (!activeAcademicYear) return res.status(404).json({ message: "Active academic year not found" });
        const donors = await DonarModel.find({ acyear: activeAcademicYear.acyear });
        res.json(donors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;