const express = require('express');
const router = express.Router();
const RejectModel = require('../models/reject');
const AmountModel = require('../models/amt');
const ApplicantModel = require('../models/fersh');
const RenewalModel = require('../models/renewal');
const DonarModel = require('../models/donardata');


router.post("/reject", (req, res) => {
    RejectModel.create(req.body)
    .then(result => res.json({ success: true, result }))
    .catch(err => res.json(err));
    
    
})


router.get('/studawardreport', async (req, res) => {
    try {
        // Aggregate records by registerNo and acyear
        const amountData = await AmountModel.aggregate([
            {
                $group: {
                    _id: {
                        registerNo: '$registerNo',
                        acyear: '$acyear'
                    },
                    totalScholamt: { $sum: '$scholamt' },
                    name: { $first: '$name' },
                    dept: { $first: '$dept' }
                }
            },
            {
                $project: {
                    registerNo: '$_id.registerNo',
                    acyear: '$_id.acyear',
                    totalScholamt: 1,
                    name: 1,
                    dept: 1,
                    _id: 0
                }
            }
        ]);

        // Send the aggregated data
        res.json(amountData);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.get('/status/:registerNo', async (req, res) => {
    try {
        const { registerNo } = req.params;

        // Sequentially check each model for data
        // let data = await AmountModel.findOne({ registerNo });
        // if (data) {
        //     return res.json(data);
        // }
        const amountData = await AmountModel.find({ registerNo });
        if (amountData && amountData.length > 0) {
            const totalScholamt = amountData.reduce((sum, entry) => sum + entry.scholamt, 0);
            console.log(totalScholamt)
            return res.json({ ...amountData[0]._doc, totalScholamt });
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
        return res.status(500).json({ status: 'error', message: 'An error occurred while fetching the student data' });
    }
});

router.get('/donarletter', async (req, res) => {
    try {
        const { name } = req.query;
        const donar = await DonarModel.findOne({ name });

        if (donar) {
            const donorId= donar._id
            console.log(donorId)
            const donoramt = await AmountModel.findOne({donorId: 'scholdonar'})
            console.log(donoramt)
            res.json(donar);

        } else {
            res.status(404).json({ message: 'Donor not found' });
        }
    } catch (err) {
        console.error('Error fetching donor data:', err);  // Improved error logging
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;

