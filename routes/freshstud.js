const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.get('/:registerNo', async (req, res) =>{
    try{
        const student = await Student.findOne({registerNo: req.params.registerNo});
        if(student){
            res.json(student);
        }
        else{
            res.status(404).send('Student Register No not found');
        }
    }
    catch(err){
        res.status(500).send(err);
    }
});

module.exports = router;