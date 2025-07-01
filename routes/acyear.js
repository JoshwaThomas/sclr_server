const express = require('express');
const router = express.Router();
const AcademicModel = require('../models/academic');

// ----------------------------------------------------------------------------------------------------------------

router.post('/acyear', async (req, res) => {

    const { acyear } = req.body;

    try {
        await AcademicModel.updateMany({}, { active: '0' });
        await AcademicModel.findOneAndUpdate({ acyear }, { active: '1' });
        res.status(200).json({ message: 'Academic year set to active successfully.' });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).json({ error: 'Failed to set academic year to active.' });
    }
});

// ----------------------------------------------------------------------------------------------------------------

router.get('/current-acyear', async (req, res) => {

    try {
        const latestAcademicYear = await AcademicModel.findOne({ active: '1' });
        if (!latestAcademicYear) {
            return res.status(404).json({ success: false, message: 'No active academic year found' });
        }
        res.status(200).json({ success: true, acyear: latestAcademicYear });
    } catch (error) {
        console.error('Error fetching current academic year:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})

module.exports = router; 