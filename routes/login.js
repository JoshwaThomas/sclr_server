// const express = require('express');
// const router = express.Router();
// const Staff = require('../models/staff');
// const ApplicantModel = require('../models/fersh')

// router.post('/login', async (req, res) => {
//     const { staffId, password } = req.body;

//     try {
//         const staff = await Staff.findOne({ staffId: staffId });
//         const stud = await ApplicantModel.findOne({ registerNo : staffId})

//         if (staff) {
//             if (staff.password === password) {
//                 console.log(staff.name)
//                 res.json({ status: "exist", role: staff.role });
//             } else {
//                 res.json({ status: "wrong password" });
//             }
//         } else if (stud){
//             console.log(stud.registerNo)
//             console.log(stud.password)
//             if (stud.password === password) {

//                 res.json({ status: "exist", role: stud.registerNo });
//             } else {
//                 res.json({ status: "wrong password" });
//             }
//         }
//         else{
//             res.json({ status: 'not exist' });
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(500).send(e);
//     }
// });

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // For hashed passwords
const crypto = require('crypto');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'Josha2422niliaw63';
const Staff = require('../models/staff'); // Your Staff model
const ApplicantModel = require('../models/fersh'); 


// Login route
router.post('/login', async (req, res) => {
    const { staffId, password } = req.body;

    try {
        const staff = await Staff.findOne({ staffId: staffId });
        const stud = await ApplicantModel.findOne({ registerNo: staffId });

        if (staff) {
            console.log("Submitted password:", password);
            console.log("Stored password:", staff.password);

            // Check if passwords match (use bcrypt if passwords are hashed)
            if (password === staff.password) {
                console.log("Password matches");
                const token = jwt.sign({ id: staff._id, role: staff.role }, JWT_SECRET, { expiresIn: '15m' });
                return res.json({ status: "exist", role: staff.role, token });
            } else {
                return res.json({ status: "wrong password" });
            }
        } else if (stud) {
            console.log("Submitted password:", password);
            console.log("Stored password:", stud.password);

            if (password === stud.password) {
                const token = jwt.sign({ id: stud._id, role: stud.registerNo }, JWT_SECRET, { expiresIn: '1h' });
                return res.json({ status: "exist", role: stud.registerNo, token });
            } else {
                return res.json({ status: "wrong password" });
            }
        } else {
            return res.json({ status: 'not exist' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});

//refresh the token
router.post('/refresh-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ status: 'fail', message: 'Token missing' });
    }

    try {
        // Decode the token 
        const decoded = jwt.verify(token, JWT_SECRET);

        // Generate a new token with extended time
        const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET, { expiresIn: '5m' });

        return res.json({ status: 'success', newToken });
    } catch (e) {
        console.log(e);
        return res.status(403).json({ status: 'fail', message: 'Invalid or expired token' });
    }
});

// Middleware to authenticate token
// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(403).json({ message: 'No token provided' });

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) return res.status(401).json({ message: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// };

// Protected route (example)
// router.get('/api/admin/protected-route', authenticateToken, (req, res) => {
//     res.json({ message: 'Protected data accessed!', user: req.user });
// });

router.get('/staffmang', async (req, res) => {
    Staff.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
})

router.put('/staffmang/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    // const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log(hashedPassword)

    Staff.findByIdAndUpdate(id, {password: password }, { new: true })
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

router.put('/staffsetting/:staffId', async (req, res) => {
    const { staffId } = req.params;
    const { password } = req.body;
    // const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)
    console.log(staffId)
    console.log(password)

    try {
        const updatedStaff = await Staff.findOneAndUpdate(
            { staffId }, 
            {password: password }, 
            { new: true } 
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
