const express = require('express');
const router = express.Router();
const AcademicModel = require('../models/academic');

router.post("/acyear", (req, res) => {
    const { acyear } = req.body;
    AcademicModel.findOne({ acyear })
    .then(existingYear =>{
        
        if(existingYear){
            return res.json({success: false, message: 'Already Existing'})
        }
  
        AcademicModel.create(req.body)
        .then(users => res.json({ success: true, users }))
        .catch(err => res.json({success: false, error: err}))
    })
    .catch(err => res.json({success: false, error: err}))
    
})
// router.get('/current-acyear', async (req, res) => {
//     try {
//         // Find the academic year with the highest acid
//         const latestAcademicYear = await AcademicModel.findOne({}, {}, { sort: { acid: -1 } });

//         if (!latestAcademicYear) {
//             return res.status(404).json({ success: false, message: 'No active academic year found' });
//         }

//         res.status(200).json({ success: true, acyear: latestAcademicYear });
//     } catch (error) {
//         console.error('Error fetching current academic year:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

router.get('/current-acyear', async (req, res) => {
    try {
        // Find the academic year with the highest acid
        const latestAcademicYear = await AcademicModel.findOne({}, {}, { sort: { acid: -1 } });

        if (!latestAcademicYear) {
            return res.status(404).json({ success: false, message: 'No active academic year found' });
        }

        res.status(200).json({ success: true, acyear: latestAcademicYear });
    } catch (error) {
        console.error('Error fetching current academic year:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;