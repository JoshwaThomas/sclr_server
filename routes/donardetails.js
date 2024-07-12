const express = require('express');
const router = express.Router();
//DonarModel update the data
const DonarModel = require('../models/donar');
//DonarDataModel contain a duplicate value 
const DonarDataModel = require('../models/donardata');
const AmountModel = require('../models/amt');


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
        const { pan } = req.body;

        // Check if donor exists in DonarModel
        let donar = await DonarModel.findOne({ pan });

        if (donar) {
            donar = await DonarDataModel.create(req.body);

            donar.balance += parseFloat(req.body.amount);
            // If donor exists, update the donor information
            donar = await DonarModel.findOneAndUpdate({ pan }, req.body, { new: true });
            
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

router.post("/donardata", (req, res) => {
    const { pan } = req.body;
    DonarDataModel.findOne({ pan })
    .then(existingDonar =>{
        
        //check the records for one more register
        if(existingDonar){
            return res.json({success: false, message: 'Donor Already Existing'})
        }
        //new record created
        DonarDataModel.create(req.body)
        DonarModel.create(req.body)

        .then(donars => res.json({ success: true, donars }))
        .catch(err => res.json({success: false, error: err}))
    })
    .catch(err => res.json({success: false, error: err}))
    
})

router.get('/donor/:pan', async (req, res) => {
    try {
        const donor = await DonarModel.findOne({ pan: req.params.pan });
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

module.exports = router;