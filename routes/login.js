const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');

router.post('/login', async (req, res) => {
    const { staffId, password } = req.body;

    try {
        const staff = await Staff.findOne({ staffId: staffId });

        if (staff) {
            if (staff.password === password) {
                res.json({ status: "exist", role: staff.role });
            } else {
                res.json({ status: "wrong password" });
            }
        } else {
            res.json({ status: 'not exist' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

module.exports = router;
