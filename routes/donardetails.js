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

router.get('/', async (req, res) => {
    try {
        const Donar = await DonarModel.findOne({ mobileNo: req.params.mobileNo });
        if (Donar) {
            res.json(Donar);
        }
        else {
            res.status(404).send('Donar No not found');
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});








// router.get('/donor/:name', async (req, res) => {
//     try {
//         const donor = await DonarModel.findOne({ name: req.params.name });
//         if (donor) {
//             res.json(donor);
//         } else {
//             res.status(404).send('Donor not found');
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.get('/donor/:did', async (req, res) => {
    try {
        const donor = await DonarModel.findOne({ did: req.params.did });
        if (donor) {
            res.json(donor);
        } else {
            res.status(404).send('Donor not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/donar', (req, res) => {

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
router.get('/donar', (req, res) => {

    const { pan } = req.body;
    DonarModel.find({ pan })
        .then(donars => res.json(donars))
        .catch(err => res.json(err));
});
router.get('/donardata', (req, res) => {
    DonarDataModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

//donor amt check and transfer the amt 
// router.put('/donar/:id', async (req, res) => {
//     try {
//         const donor = await DonarModel.findById(req.params.id);
//         if (donor) {
//             const balanceField = req.body.balanceField || 'balance';
//             if (donor[balanceField] >= req.body.amount) {
//                 donor[balanceField] -= parseFloat(req.body.amount);
//                 console.log("hello", donor[balanceField])
//                 await donor.save();
//                 res.status(200).json({ updatedBalance: donor[balanceField] });
//             } else {
//                 res.status(400).json({ message: 'Insufficient balance', availableBalance: donor[balanceField] });
//             }
//         } else {
//             res.status(404).send('Donor not found');
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Amount save routes
// router.post('/freshamt', async (req, res) => {
//     const registerNo = req.body
//     console.log({ registerNo })
//     try {
//         const donor = await DonarModel.findById(req.body.scholdonar);
//         if (donor) {
//             console.log('donor', donor)
//             await AmountModel.create(req.body);
//             res.status(201).send('Amount data saved successfully');
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// Update the Donor Details find and res
router.get('/donarUpdate', async (req, res) => {
    try {
        const { did } = req.query;
        // Check if donor exists in DonarModel
        let donar = await DonarDataModel.findOne({ did });

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
        const { did } = req.body;

        // Check if donor exists in DonarModel
        let donar = await DonarDataModel.findOne({ did });

        if (donar) {

            donar = await DonarDataModel.updateMany({ did }, req.body, { new: true });
            donar = await DonarModel.findOneAndUpdate({ did }, req.body, { new: true });

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
        ScholtypeModel.findOne({ scholtype })
            .then(existingType => {
                if (existingType) {
                    return res.json({ success: false, message: 'ScholarType Already Existing' })
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
        const reapplicants = await RenewalModel.find()
        // console.log(reapplicants)
        const applicants = await ApplicantModel.find();
        // console.log(applicants)
        const donars = await DonarModel.find();

        const combinedData = amounts.map(amount => {
            const reapplicant = reapplicants.find(app => app.registerNo === amount.registerNo)
            const applicant = applicants.find(app => app.registerNo === amount.registerNo);
            const donar = donars.find(don => don._id.toString() === amount.scholdonar);
            // console.log(amount.fresherOrRenewal)
            return {
                ...amount.toObject(),
                ...reapplicant ? reapplicant.toObject() : {},
                ...applicant ? applicant.toObject() : {},
                ...donar ? donar.toObject() : {},
                donarName: donar ? donar.name : null,
                smobileNo: applicant ? applicant.mobileNo : null,
                name: applicant ? applicant.name : null,
                fresherOrRenewal: amount ? amount.fresherOrRenewal : null,
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
            switch (applicant.action) {
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
        const updatedRenewal = renewals.map(renewal => {
            let actionStatus;
            switch (renewal.action) {
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

router.get("/donoravl", (req, res) => {
    DonarModel.find()
        .then(rusers => res.json(rusers))
        .catch(err => res.json(err));
})
router.get("/donoracyear-report", (req, res) => {
    DonarDataModel.find()
        .then(rusers => res.json(rusers))
        .catch(err => res.json(err));
})
















// ----------------------------------------------------------------------------------------------------------------

// Donar Amount Deduction 

router.put('/donar/multiple', async (req, res) => {

    try {

        const { donors } = req.body;

        if (!Array.isArray(donors) || donors.length === 0) { return res.status(400).json({ success: false, message: "Donor list is empty or invalid" }) }

        const insufficient = [];

        for (const { donorId, amount, balanceField = 'balance' } of donors) {
            const donor = await DonarModel.findById(donorId);
            if (!donor || donor[balanceField] < parseFloat(amount)) {
                insufficient.push({
                    donorId, required: amount,
                    available: donor?.[balanceField] ?? 0,
                })
            }
        }

        if (insufficient.length > 0) { return res.status(400).json({ success: false, message: "Insufficient balance", insufficient }) }

        for (const { donorId, amount, balanceField = 'balance' } of donors) {
            const donor = await DonarModel.findById(donorId);
            donor[balanceField] -= parseFloat(amount);
            await donor.save();
        }

        return res.status(200).json({ success: true, message: "Donor balances updated successfully" });

    } catch (err) {
        console.error("Error in /donar/multiple:", err);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

// ----------------------------------------------------------------------------------------------------------------

// Student Data Saving in Amount Model

router.post('/freshamt', async (req, res) => {

    const { registerNo, name, dept, scholtype, scholdonar, scholamt, acyear, fresherOrRenewal } = req.body;

    try {

        if (!scholdonar) { return res.status(400).json({ success: false, message: 'Donor ID missing' }) }
        const donor = await DonarModel.findById(scholdonar);
        if (!donor) { return res.status(404).json({ success: false, message: 'Donor not found' }) }

        const amountDoc = await AmountModel.create({
            registerNo, name, dept, scholtype,
            scholdonar, scholamt, acyear, fresherOrRenewal
        });

        return res.status(201).json({ success: true, message: 'Scholarship entry saved', data: amountDoc });

    } catch (err) {
        console.error("Error in Fresh Amt :", err);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

// ----------------------------------------------------------------------------------------------------------------

// Find Last Donar Id for Adding Donar

router.get('/last-donor-id', async (req, res) => {

    try {

        const lastDonor = await DonarModel.aggregate([
            { $addFields: { didAsInt: { $toInt: "$did" } } },
            { $sort: { didAsInt: -1 } },
            { $limit: 1 }
        ]).exec();

        const lastDid = lastDonor.length > 0 ? lastDonor[0].didAsInt : 0;
        res.json({ lastDid });

    } catch (error) {
        console.log("Error in Fetch Last Donar Id for Adding : ", error)
        res.status(500).json({ error: 'Error fetching last donor ID' });
    }
})

// ----------------------------------------------------------------------------------------------------------------

// For Adding Donar

router.post("/donardata", async (req, res) => {

    const { did } = req.body;

    try {

        const existingDonar = await DonarDataModel.findOne({ did });

        if (existingDonar) { return res.json({ success: false, message: 'Donor Already Existing' }) }

        const donarModelData = await DonarModel.create(req.body);
        const donarDataModelData = await DonarDataModel.create(req.body);
        return res.json({ success: true, donarModelData, donarDataModelData });

    } catch (err) {
        console.error("Error saving donor data:", err);
        return res.json({ success: false, error: err });
    }
})

// ----------------------------------------------------------------------------------------------------------------

// Updating Donar Balance

router.post('/donar', async (req, res) => {

    try {

        const { did, amount = '0', zakkathamt = '0' } = req.body;
        const parsedAmount = parseFloat(amount) || 0;
        const parsedZakkathAmt = parseFloat(zakkathamt) || 0;

        let existingDonor = await DonarModel.findOne({ did });

        if (existingDonor) {

            const newBalance = (existingDonor.balance || 0) + parsedAmount;
            const newZakkathBalance = (existingDonor.zakkathbal || 0) + parsedZakkathAmt;
            await DonarModel.findOneAndUpdate({ did }, { ...req.body, balance: newBalance, zakkathbal: newZakkathBalance }, { new: true })
            const updatedData = { ...req.body, balance: newBalance, zakkathbal: newZakkathBalance }
            const newEntry = await DonarDataModel.create(updatedData);
            return res.json({ success: true, data: newEntry });

        }  else {

            const initialBalance = parsedAmount;
            const initialZakkathBal = parsedZakkathAmt;
            const donorData = { ...req.body, balance: initialBalance, zakkathbal: initialZakkathBal }
            const newDonor = new DonarModel(donorData);
            await newDonor.save();
            const newEntry = await DonarDataModel.create(donorData);
            return res.json({ success: true, data: newEntry });
        }

    } catch (err) {
        console.error("Error saving donor data:", err);
        res.status(500).json({ success: false, error: err.message });
    }
})

module.exports = router;