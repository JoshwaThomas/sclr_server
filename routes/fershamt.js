const express = require('express');
const router = express.Router();
const AmountModel = require('../models/amt');
const DonarModel = require('../models/donar');
const AcademicModel = require('../models/academic')

// ----------------------------------------------------------------------------------------------------------------

router.get("/freshamt", async (req, res) => {
    const activeAcademicYear = await AcademicModel.findOne({ active: '1' });
    AmountModel.find({ acyear: activeAcademicYear.acyear }).then(users => res.json(users)).catch(err => res.json(err));
})

// ----------------------------------------------------------------------------------------------------------------

router.get("/donors", async (req, res) => {
    const activeAcademicYear = await AcademicModel.findOne({ active: '1' });
    DonarModel.find({ acyear: activeAcademicYear.acyear }).then(donors => res.json(donors)).catch(err => res.json(err));
});

module.exports = router;