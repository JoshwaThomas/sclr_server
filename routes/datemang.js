const express = require('express');
const router = express.Router();
const DateModel = require('../models/date')

// ----------------------------------------------------------------------------------------------------------------

// To Upsert Date for Application

router.post('/dates', async (req, res) => {
    const { startDate, endDate } = req.body;
    await DateModel.findOneAndUpdate({},
        { startDate, endDate }, { upsert: true });
    res.send('Dates Saved');
});

// ----------------------------------------------------------------------------------------------------------------

// To fetch Dates for Admin

router.get('/dates', async (req, res) => {
    const dateRange = await DateModel.findOne().sort({ _id: -1 });
    res.json(dateRange);
});

module.exports = router;