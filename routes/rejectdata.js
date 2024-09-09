const express = require('express');
const router = express.Router();
const RejectModel = require('../models/reject');
const AmountModel = require('../models/amt');
const ApplicantModel = require('../models/fersh');
const RenewalModel = require('../models/renewal');
const DonarDataModel = require('../models/donardata');
const DonarModel = require('../models/donar')


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
                    dept: { $first: '$dept' },
                    amtdate: {$first: '$amtdate'}
                }
            },
            {
                $project: {
                    registerNo: '$_id.registerNo',
                    acyear: '$_id.acyear',
                    totalScholamt: 1,
                    name: 1,
                    dept: 1,
                    amtdate: 1,
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

router.get('/studstatus', async (req, res) => {
    try {
        const { registerNo } = req.query;

        let applicant = await RenewalModel.findOne({ registerNo });

        if (!applicant) {
            applicant = await ApplicantModel.findOne({ registerNo });
        }

        if (applicant) {
                console.log(applicant)
           
                let data = await RejectModel.findOne({ registerNo });
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
        } else {
            return res.json({ success: false, message: 'Applicant does not exist' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: 'error', message: 'An error occurred while fetching the student data' });
    }
});
router.get('/donarletter', async (req, res) => {
    try {
        const { name } = req.query;
        console.log(`Searching for donor with name: ${name}`);

        const donar = await DonarDataModel.findOne({ name });
        console.log('Donar data:', donar);
        const donoramount = donar.amount
        console.log('Donor Amount:', donoramount)

        if (donar) {
            const donorId = donar.did;
            console.log(`Found donorId (did): ${donorId}`);

            if (!donorId) {
                return res.status(404).json({ message: 'Did not found in DonarDataModel' });
            }

            const donorIdfind = await DonarModel.findOne({ did: donorId });
            console.log('DonarModel data:', donorIdfind);

            if (donorIdfind) {
                const donorId1 = donorIdfind._id;
                console.log(`Found donorId1 (_id): ${donorId1}`);

                const donoramt = await AmountModel.find({ scholdonar: donorId1 });
                console.log('AmountModel data:', donoramt);

                if(donoramt.length > 0) {
                    const studreg = donoramt[0].registerNo;  // Access the first element's registerNo
                    console.log(`Student reg.no: ${studreg}`);

                    const stud = await ApplicantModel.find({ registerNo: studreg });
                    if (stud) {
                        console.log('Student details:', stud);
                        res.json({
                            donorname: donar.name,
                            donordate: donar.scholdate,
                            donoramount: donar.amount,
                            studname: stud[0].name,
                            studdept: stud[0].dept,
                            studreg: stud[0].registerNo,
                            donoramtscholamt: donoramt[0].scholamt,  
                            studmobileNo: stud[0].mobileNo, 
                            donar,
                            donoramt,
                            stud
                        });
                    } else {
                        res.status(404).json({ message: 'Student not found' });
                    }

                } else {
                    res.status(404).json({ message: 'Amount not found' });
                }
            } else {
                res.status(404).json({ message: 'Donor not found in DonarModel' });
            }
        } else {
            res.status(404).json({ message: 'Donor not found in DonarDataModel' });
        }
    } catch (err) {
        console.error('Error fetching donor data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;

