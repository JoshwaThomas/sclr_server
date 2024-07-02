const express = require('express');
const router = express.Router();
const DonarModel = require('../models/donar');

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

router.post('/donar', (req, res) => {
    DonarModel.create(req.body)
        .then(donor => res.json(donor))
        .catch(err => res.json(err));
});

router.get('/donar', (req,res) => {
    DonarModel.find()
    .then(donars => res.json(donars))
    .catch(err => res.json(err));
});

router.put('/donar/:id', async (req, res) => {
    try {
        const donar = await DonarModel.findById(req.params.id);
        if (donar) {
            // Update the balance
            donar.balance -= parseFloat(req.body.amount);
            await donar.save();

            // Respond with the updated balance
            res.status(200).json({ updatedBalance: donar.balance });
        } else {
            // If donor is not found, return 404
            res.status(404).send('Donar not found');
        }
    } catch (err) {
        // Handle any errors that occur during the update process
        res.status(500).send(err);
    }
});

module.exports = router;