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

module.exports = router;