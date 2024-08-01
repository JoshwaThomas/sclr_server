const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const ApplicantModel = require('../models/fersh')

router.post('/login', async (req, res) => {
    const { staffId, password } = req.body;

    try {
        const staff = await Staff.findOne({ staffId: staffId });
        const stud = await ApplicantModel.findOne({ registerNo : staffId})

        if (staff) {
            if (staff.password === password) {
                res.json({ status: "exist", role: staff.role });
            } else {
                res.json({ status: "wrong password" });
            }
        } else if (stud){
            console.log(stud.registerNo)
            console.log(stud.password)
            if (stud.password === password) {
             
                res.json({ status: "exist", role: stud.registerNo });
            } else {
                res.json({ status: "wrong password" });
            }
        }
        else{
            res.json({ status: 'not exist' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

module.exports = router;
