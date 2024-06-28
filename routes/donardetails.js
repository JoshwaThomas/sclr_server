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


module.exports = router;