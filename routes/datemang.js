const express = require('express');
const router = express.Router();
const DateModel = require('../models/date')

router.post('/dates', async (req, res) => {
    const { startDate, endDate } = req.body;
    const dateRange = new DateModel({ startDate, endDate });
    await dateRange.save();
    res.send('Dates saved');
});

router.get('/dates', async (req, res) => {
    const dateRange = await DateModel.findOne().sort({ _id: -1 });
    res.json(dateRange);
});

module.exports = router;