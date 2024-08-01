const express = require('express');
const router = express.Router();
//DonarModel update the data
const DonarModel = require('../models/donar');
//DonarDataModel contain a duplicate value 
const DonarDataModel = require('../models/donardata');
const AmountModel = require('../models/amt');
const ScholtypeModel = require('../models/scholtype');
const ApplicantModel = require('../models/fersh');
const RenewalModel = require('../models/renewal');

router.get('/', async (req, res) =>{
    try{
        const Donar = await DonarModel.findOne({mobileNo: req.params.mobileNo});
        if(Donar){
            res.json(Donar);
        }
        else{
            res.status(404).send('Donar No not found');
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});

// router.post('/donar', (req, res) => {
//     DonarDataModel.create(req.body)
//         .then(donor => res.json(donor))
//         .catch(err => res.json(err));
//     DonarDataModel.findOne({pan: req.params.pan});
//         DonarModel.save()
//         .then(update => res.json(update))
//         .catch(err => res.json(err));
// });

router.post('/donar', async (req, res) => {
    try {
        const { pan, amount } = req.body;

        // Check if donor exists in DonarModel
        let donar = await DonarModel.findOne({ pan });

        if (donar) {
           
            const newBalance = donar.balance + parseFloat(amount);
            console.log("Balance :",newBalance)
            // If donor exists, update the donor information
            donar = await DonarModel.findOneAndUpdate({ pan }, { ...req.body, balance: newBalance}, { new: true });

            donar = await DonarDataModel.create(req.body);

            
            res.json(donar);
        } else {
            // If donor doesn't exist, create a new entry in DonarDataModel
            donar = await DonarDataModel.create(req.body);

            // Save the same data in DonarModel
            const newDonar = new DonarModel(req.body);
            await newDonar.save();

            res.json(donar);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/donardata", async (req, res) => {
    const { did } = req.body;

    try {
        const existingDonar = await DonarDataModel.findOne({ did });
        if (existingDonar) {
            return res.json({ success: false, message: 'Donor Already Existing' });
        }

        const donarModelData = await DonarModel.create(req.body);
        const donarDataModelData = await DonarDataModel.create(req.body);
        // console.log(donarModelData)
        // console.log(donarDataModelData)

        return res.json({ success: true, donarModelData, donarDataModelData });
    } catch (err) {
        console.error("Error saving donor data:", err);
        return res.json({ success: false, error: err });
    }
});

router.get('/donor/:name', async (req, res) => {
    try {
        const donor = await DonarModel.findOne({ name: req.params.name });
        if (donor) {
            res.json(donor);
        } else {
            res.status(404).send('Donor not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
router.get('/donar', (req,res) => {
    
    DonarModel.find()
    .then(donars => res.json(donars))
    .catch(err => res.json(err));
});
router.get('/scholtypes', (req, res) => {
    DonarModel.distinct("scholtype")
        .then(scholtypes => res.json(scholtypes))
        .catch(err => res.json(err));

});
router.get('/scholtypelist', (req, res) => {
    DonarModel.find()
        .then(scholtypes => res.json(scholtypes))
        .catch(err => res.json(err));

});
router.get('/panlist', (req, res) => {
    DonarModel.find()
        .then(panList => res.json(panList))
        .catch(err => res.status(500).json({ error: err.message }));
});
router.get('/donar', (req,res) => {
    
    const { pan } = req.body;
    DonarModel.find({pan})
    .then(donars => res.json(donars))
    .catch(err => res.json(err));
});
router.get('/donardata', (req,res) => {
    DonarDataModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

//Accept Amount transanction function check the balance for donar_balance 
router.put('/donar/:id', async (req, res) => {
    try {
        const donor = await DonarModel.findById(req.params.id);
        if (donor) {
            if (donor.balance >= req.body.amount) {
                donor.balance -= parseFloat(req.body.amount);
                await donor.save();
                res.status(200).json({ updatedBalance: donor.balance });
            } else {
                res.status(400).json({ message: 'Insufficient balance', availableBalance: donor.balance });
            }
        } else {
            res.status(404).send('Donor not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Amount save routes
router.post('/freshamt', async (req, res) => {
    try {
        const donor = await DonarModel.findById(req.body.scholdonar);
        if (donor && donor.balance >= req.body.scholamt) {
            await AmountModel.create(req.body);
            res.status(201).send('Amount data saved successfully');
        } 
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update the Donor Details find and res
router.get('/donarUpdate', async (req, res) => {
    try {
        const { name } = req.query; 
        // Check if donor exists in DonarModel
        let donar = await DonarDataModel.findOne({ name });

        if (donar) {
            res.json(donar);
        } else {
            res.status(404).json({ message: 'Donor not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// Update the Donor Details find  and update
router.post('/donarUpdate', async (req, res) => {
    try {
        const { pan } = req.body;

        // Check if donor exists in DonarModel
        let donar = await DonarDataModel.findOne({ pan });

        if (donar) {
           
            donar = await DonarDataModel.findOneAndUpdate({ pan }, req.body, { new: true });
            
            res.json(donar);
        } 
    } catch (err) {
        res.status(500).json(err);
    }
});

//Add the scholar Type

router.post('/scholtype', async (req, res) => {
    try {
        const { scholtype } = req.body;

        // Check if scholar Type exists
        ScholtypeModel.findOne({scholtype})
        .then(existingType=>{
            if(existingType) {
                return res.json({success: false, message: 'ScholarType Already Existing'})
            }
        ScholtypeModel.create(req.body)
        .then(users => res.json({ success: true, users }))
        .catch(err => res.json({ success: false, error: err }));
        })
        .catch(err => res.json({ success: false, error: err }));
    }
    catch (err) {
        res.status(500).send(err);
    }  
});

//All the Report
router.get('/allreport', async (req, res) => {
    try {
        const amounts = await AmountModel.find();
        const applicants = await ApplicantModel.find();
        const donars = await DonarModel.find();

        const combinedData = amounts.map(amount => {
            const applicant = applicants.find(app => app.registerNo === amount.registerNo);
            const donar = donars.find(don => don._id.toString() === amount.scholdonar);

            return {
                ...amount.toObject(),
                ...applicant ? applicant.toObject() : {},
                ...donar ? donar.toObject() : {},
                donarName: donar ? donar.name : null,
                smobileNo: applicant ? applicant.mobileNo : null,
                name: applicant ? applicant.name : null, 
            };
        });

        res.json(combinedData);
    } catch (err) {
        res.json(err);
    }
});
router.get('/studreport', async (req, res) => {
    try {
        const applicants = await ApplicantModel.find();
        const renewals = await RenewalModel.find();

        const updatedApplicants = applicants.map(applicant => {
            let actionStatus;
            switch(applicant.action) {
                case 0:
                    actionStatus = 'pending';
                    break;
                case 1:
                    actionStatus = 'accepted';
                    break;
                case 2:
                    actionStatus = 'rejected';
                    break;
                default:
                    actionStatus = 'unknown';
            }
            return {
                ...applicant.toObject(),
                action: actionStatus
            };
        });
        const updatedRenewal = renewals.map(renewal =>{
            let actionStatus;
            switch(renewal.action) {
                case 0:
                    actionStatus = 'pending';
                    break;
                case 1:
                    actionStatus = 'accepted';
                    break;
                case 2:
                    actionStatus = 'rejected';
                    break;
                default:
                    actionStatus = 'unknown';
            }
            return {
                ...renewal.toObject(),
                action: actionStatus
            };
        });

        const combine = [...updatedApplicants, ...updatedRenewal];
        res.json(combine);
    } catch (err) {
        res.json(err);
    }
});

router.get("/donoravl", (req,res) => {
    DonarModel.find()
    .then(rusers => res.json(rusers))
    .catch(err => res.json(err));
})
router.get("/donoracyear-report", (req,res) => {
    DonarDataModel.find()
    .then(rusers => res.json(rusers))
    .catch(err => res.json(err));
})

router.get('/last-donor-id', async (req, res) => {
    try {
        const lastDonor = await DonarModel.findOne().sort({ did: -1 }).exec();
        const lastDid = lastDonor ? parseInt(lastDonor.did, 10) : 0;
        res.json({ lastDid });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching last donor ID' });
    }
});

module.exports = router;