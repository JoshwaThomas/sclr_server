const express = require('express');
const router = express.Router();
const RejectModel = require('../models/reject');
const AmountModel = require('../models/amt');
const ApplicantModel = require('../models/fersh');


router.post("/reject", (req, res) => {
    RejectModel.create(req.body)
    .then(result => res.json({ success: true, result }))
    .catch(err => res.json(err));
    
    
})

router.get('/status/:registerNo', async (req, res) => {
   
    try {
        const stat = await ApplicantModel.findOne({registerNo: req.params.registerNo});
        const stat1 = await AmountModel.findOne({registerNo: req.params.registerNo});
        const stat2 = await RejectModel.findOne({registerNo: req.params.registerNo});

        if (stat1) {
            res.json(stat1);
        }
        else if(stat2){
            res.json(stat2);
        } 
        else if(stat){
            res.json(stat);
        }
        else {
            res.json({ status: 'not exist' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});
// router.post('/adstatus/:registerNo', async (req, res) =>{ /studentstatus
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

