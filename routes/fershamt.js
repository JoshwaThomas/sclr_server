const express = require('express');
const router = express.Router();
const AmountModel = require('../models/amt');
const DonarModel = require('../models/donar');
const AcademicModel=require('../models/academic')

// router.post("/freshamt", (req, res) => {
//     AmountModel.create(req.body)
//     .then(result => res.json(result))
//     .catch(err => res.json(err));


// })

router.get("/freshamt", async (req, res) => {
    const activeAcademicYear = await AcademicModel.findOne({active: '1'});
    AmountModel.find({acyear:activeAcademicYear.acyear})
        .then(users => res.json(users))
        .catch(err => res.json(err));
})

router.get("/donors", async (req, res) => {
    const activeAcademicYear = await AcademicModel.findOne({active: '1'});
   
    DonarModel.find({acyear:activeAcademicYear.acyear})
        .then(donors => res.json(donors))
        .catch(err => res.json(err));
});

// router.get("/students", async (req, res) => {
//     const { registerNo } = req.query;

//     try {
//         const student = await AmountModel.findOne({registerNo: registerNo});
//         if (student) {
//             res.json(student);
//         } else {
//             res.status(404).send('Student with the specified Register No and Mobile No not found');
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

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

