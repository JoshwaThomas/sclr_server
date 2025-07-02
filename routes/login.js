const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'Josha2422niliaw63';
const Staff = require('../models/staff');
const ApplicantModel = require('../models/fersh');

// ----------------------------------------------------------------------------------------------------------------

// Login Route 

router.post('/login', async (req, res) => {

    const { staffId, password } = req.body;

    try {
        const staff = await Staff.findOne({ staffId: staffId });
        const stud = await ApplicantModel.findOne({ registerNo: staffId });
        if (staff) {
            if (password === staff.password) {
                const token = jwt.sign({ id: staff._id, role: staff.role }, JWT_SECRET, { expiresIn: '30m' });
                return res.json({ status: "exist", role: staff.role, token, });
            } else { return res.json({ status: "wrong password" }) }
        } else if (stud) {
            if (password === stud.password) {
                const token = jwt.sign({ id: stud._id, role: stud.registerNo }, JWT_SECRET, { expiresIn: '1h' });
                return res.json({ status: "exist", role: stud.registerNo, token });
            } else { return res.json({ status: "wrong password" }) }
        } else { return res.json({ status: 'not exist' }) }
    } catch (error) {
        console.log('Error while Login : ', error);
        return res.status(500).send(error);
    }
})

// ----------------------------------------------------------------------------------------------------------------

// Refresh the Token

router.post('/refresh-token', (req, res) => {

    const { token } = req.body;

    if (!token) { return res.status(400).json({ status: 'fail', message: 'Token missing' })}

    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(403).json({ status: 'fail', message: 'Invalid token' });
        }
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            return res.status(403).json({ status: 'fail', message: 'Token expired' });
        }
        const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            JWT_SECRET,
            { expiresIn: '30m' }
        );
        return res.json({ status: 'success', newToken });
    } catch (error) {
        console.error('Error during token refresh:', error);
        return res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
})

// ----------------------------------------------------------------------------------------------------------------

router.get('/staffmang', async (req, res) => {
    Staff.find() .then(users => res.json(users)).catch(err => res.json(err));
})

// ----------------------------------------------------------------------------------------------------------------

router.put('/staffmang/:id', async (req, res) => {

    const { id } = req.params;
    const { password } = req.body;
    Staff.findByIdAndUpdate(id, { password: password }, { new: true })
        .then(user => res.json(user))
        .catch(err => res.json(err));
})

// ----------------------------------------------------------------------------------------------------------------

router.put('/staffsetting/:staffId', async (req, res) => {

    const { staffId } = req.params;
    const { password } = req.body;

    try {
        const updatedStaff = await Staff.findOneAndUpdate(
            { staffId },
            { password: password },
            { new: true }
        )
        if (!updatedStaff) { return res.status(404).json({ error: 'Staff not found' }) }
        res.json(updatedStaff);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
})

// ----------------------------------------------------------------------------------------------------------------

module.exports = router;