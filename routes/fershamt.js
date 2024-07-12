const express = require('express');
const router = express.Router();
const AmountModel = require('../models/amt');
const DonarModel = require('../models/donar');

// router.post("/freshamt", (req, res) => {
//     AmountModel.create(req.body)
//     .then(result => res.json(result))
//     .catch(err => res.json(err));
    
    
// })

router.get("/freshamt", (req, res) => {
    AmountModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

router.get("/donors", (req, res) => {
    DonarModel.find()
        .then(donors => res.json(donors))
        .catch(err => res.json(err));
});

// router.post('/adstatus/:registerNo', async (req, res) =>{
//     try{
//         const student = await AmountModel.findOne({registerNo: req.params.registerNo});
//         if(student){
//             res.json(student);
//         }
//         else{
//             res.status(404).send('Student Register No not found');
//         }
//     }
//     catch(err){
//         res.status(500).send(err);
//     }
// });

module.exports = router;

