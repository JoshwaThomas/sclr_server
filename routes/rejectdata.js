const express = require('express');
const router = express.Router();
const RejectModel = require('../models/reject');
const AmountModel = require('../models/amt');
const ApplicantModel = require('../models/fersh');
const RenewalModel = require('../models/renewal');


router.post("/reject", (req, res) => {
    RejectModel.create(req.body)
    .then(result => res.json({ success: true, result }))
    .catch(err => res.json(err));
    
    
})

router.get('/status/:registerNo', async (req, res) => {
    try {
        const { registerNo } = req.params;

        // Sequentially check each model for data
        let data = await AmountModel.findOne({ registerNo });
        if (data) {
            return res.json(data);
        }

        data = await RejectModel.findOne({ registerNo });
        if (data) {
            return res.json(data);
        }

        data = await RenewalModel.findOne({ registerNo });
        if (data) {
            return res.json(data);
        }

        data = await ApplicantModel.findOne({ registerNo });
        if (data) {
            return res.json(data);
        }

        // If no results are found
        return res.json({ status: 'not exist' });
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});

module.exports = router;

