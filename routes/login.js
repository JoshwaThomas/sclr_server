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
                console.log(staff.name)
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

router.get('/staffmang', async (req, res) =>{
    Staff.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
})

router.put('/staffmang/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    Staff.findByIdAndUpdate(id, { password }, { new: true })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

router.put('/staffsetting/:staffId', async (req, res) => {
    const { staffId } = req.params;
    const { password } = req.body;
    console.log(staffId)
    console.log(password)
  
    try {
        // Assuming `Staff` is your model and `staffId` is the field to identify the staff
        const updatedStaff = await Staff.findOneAndUpdate(
            { staffId }, // Query to find the staff by `staffId`
            { password }, // Update the password field
            { new: true } // Return the updated document
        );

        if (!updatedStaff) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        res.json(updatedStaff);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

module.exports = router;
