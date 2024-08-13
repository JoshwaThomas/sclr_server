const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require("multer");
// const path = require("path");
const ApplicantModel = require('./models/fersh')
const RenewalModel = require('./models/renewal')
const AmountModel = require('./models/amt')
// const Student = require('./routes/freshstud')
const Dashboard = require('./routes/dashboard')
const Acyear = require('./routes/acyear')
const Donardetails = require('./routes/donardetails')
const Login = require('./routes/login')
const Amount = require('./routes/fershamt')
const Reject = require('./routes/rejectdata')


const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}))

app.use(express.json())
//Put reg.no. get the data freshform 
// app.use('/api/students', Student);
app.use('/api/dashboard', Dashboard);
app.use('/api/admin', Acyear);
app.use('/api/admin', Donardetails);
app.use('/api/admin', Login);
app.use('/api/admin', Amount);
app.use('/api/admin', Reject);


mongoose.connect("mongodb://127.0.0.1:27017/sclr")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./zamathfiles");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});
const upload = multer({ storage: storage });

//   const upload = multer({ storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }
//    });



app.post("/fresh", upload.single("jamath"), (req, res) => {
    console.log("Received file:", req.file); // Should show file information
    console.log("Received body:", req.body);

    const { registerNo } = req.body;
    const yearOfPassing = req.body.yearOfPassing && req.body.yearOfPassing !== "undefined" ? Number(req.body.yearOfPassing) : null;
    const siblingsNo = req.body.siblingsNo && req.body.siblingsNo !== "undefined" ? Number(req.body.siblingsNo) : null;
    const siblingsIncome = req.body.siblingsIncome && req.body.siblingsIncome !== "undefined" ? Number(req.body.siblingsIncome) : null;

    // Create the applicantData object with the processed values
    const applicantData = {
        ...req.body,
        yearOfPassing,
        siblingsNo,
        siblingsIncome,
        jamath: req.file ? req.file.path : null // Add file path to data
    };

    ApplicantModel.findOne({ registerNo })

        .then((existingUsers) => {
            if (existingUsers) {
                return res.json({ success: false, message: "Register No. Already Existing" });
            }

            ApplicantModel.create(applicantData)
                .then(users => res.json({ success: true, users }))
                .catch(err => {
                    console.error("Error saving applicant data:", err);
                    res.json({ success: false, error: err });
                });
        })
        .catch((err) => {
            console.error("Error fetching student data:", err);
            res.status(500).send({ message: "Internal server error", error: err });
        });
});

app.post("/renewal", upload.single("jamath"), (req, res) => {
    console.log("Received file:", req.file); // Should show file information
    console.log("Received body:", req.body);

    const { registerNo } = req.body;
    const siblingsNo = req.body.siblingsNo && !isNaN(req.body.siblingsNo) ? Number(req.body.siblingsNo) : null;
    const siblingsIncome = req.body.siblingsIncome && !isNaN(req.body.siblingsIncome) ? Number(req.body.siblingsIncome) : null;


    //check the records for one more register
    const applicantData = {
        ...req.body,
        siblingsNo,
        siblingsIncome,
        jamath: req.file ? req.file.path : null // Add file path to data
    };

    RenewalModel.findOne({ registerNo })
        .then(existingUsers => {
            if (existingUsers) {
                return res.json({ success: false, message: 'Register No. Already Existing' })
            }
            //create a new record
            RenewalModel.create(applicantData)
                // console.log("Applicant:", applicantData)
                .then(users => res.json({ success: true, users }))
                .catch(err => {
                    console.error('Error creating renewal record:', err);
                    res.status(500).json({ success: false, message: 'Failed to create record', error: err.message });
                });
        })
        .catch(err => res.json({ success: false, error: err }));
})

// worked
// app.post("/fresh", (req, res) => {
//     const { registerNo } = req.body;
//     console.log(`Received request for registerNo: ${registerNo}`);
//     // console.log(`Received request for password: ${password}`);
//     // delete rest.password;

//     ApplicantModel.findOne({ registerNo })
//       .then(existingUsers => {
//         if (existingUsers) {
//           return res.json({ success: false, message: 'Register No. Already Existing' });
//         }
//         ApplicantModel.create(req.body)
//           .then(users => res.json({ success: true, users }))
//           .catch(err => {
//             console.error('Error creating user:', err);
//             res.json({ success: false, message: 'Error creating user', error: err });
//           });
//       })
//       .catch(err => {
//         console.error('Error fetching student data:', err);
//         res.status(500).json({ success: false, message: 'Internal server error', error: err });
//       });
//   });

// Worked Renewal
// app.post("/renewal", (req, res) => {
//     const { registerNo } = req.body;
//     //check the records for one more register
//     RenewalModel.findOne({ registerNo })
//         .then(existingUsers => {
//             if (existingUsers) {
//                 return res.json({ success: false, message: 'Register No. Already Existing' })
//             }
//             //create a new record
//             RenewalModel.create(req.body)
//                 .then(users => res.json({ success: true, users }))
//                 .catch(err => res.json({ success: false, error: err }));
//         })
//         .catch(err => res.json({ success: false, error: err }));

// })

app.post("freshaction/:registerNo", (req, res) => {
    const { registerNo } = req.body;
    ApplicantModel.findOneAndUpdate({ registerNo }, req.body, { new: true })
        .then(users => res.json({ success: true, users }))
        .catch(err => res.json({ success: false, error: err }));

})
app.post("/api/admin/action", (req, res) => {
    const { registerNo } = req.body;
    ApplicantModel.findOneAndUpdate({ registerNo }, { action: '1' })
        .then(result => res.json({ success: true, result }))
        .catch(err => res.json({ success: false, error: err }));
})
app.post("/api/admin/actionreject", (req, res) => {
    const { registerNo } = req.body;
    ApplicantModel.findOneAndUpdate({ registerNo }, { action: '2' })
        .then(result => res.json({ success: true, result }))
        .catch(err => res.json({ success: false, error: err }));
})


app.use('/zamathfiles', express.static('zamathfiles'));

app.get("/fresh", (req, res) => {
    ApplicantModel.find()
        .then(users => {
            const usersWithFileURL = users.map(user => ({
                ...user._doc,
                jamath: user.jamath ? `${req.protocol}://${req.get('host')}/${user.jamath.replace(/\\/g, '/')}` : null
            }));
            res.json(usersWithFileURL);
        })
        .catch(err => res.json(err));
});
// app.get("/fresh", (req, res) => {
//     ApplicantModel.find()
//         .then(users => res.json(users))
//         .catch(err => res.json(err));
// })

//get the student details for using renewal form and check the amount table bcz once fresher recive the amt then apply renewal
app.get('/api/admin/students', async (req, res) => {
    const { registerNo, mobileNo } = req.query;
    console.log(`Received request for registerNo: ${registerNo}, mobileNo: ${mobileNo}`);

    // try {
    //     const student = await ApplicantModel.findOne({ registerNo: registerNo, mobileNo: mobileNo });
    //     const amount = await AmountModel.findOne({ registerNo });
    //     if (student && amount) {
    //         const response = { ...student.toObject(), scholamt: amount.scholamt };
    //         res.json(response);
    //     } else {
    //         console.log('Student or amount not found');
    //         res.status(404).send('Student with the specified Register No and Mobile No not found');
    //     }
    // }
    try {
        // Find the student by registerNo and mobileNo
        const student = await ApplicantModel.findOne({ registerNo: registerNo, mobileNo: mobileNo });

        if (!student) {
            console.log('Student not found');
            return res.status(404).send('Student with the specified Register No and Mobile No not found');
        }

        // Find all matching entries in AmountModel for the given registerNo and sum the scholamt
        const amounts = await AmountModel.find({ registerNo });
        const totalScholamt = amounts.reduce((sum, entry) => sum + entry.scholamt, 0);

        // Combine student data with the total scholamt and send the response
        const response = { ...student.toObject(), scholamt: totalScholamt };
        res.json(response);
    }
    catch (err) {
        console.error('Error fetching student data:', err); // Detailed logging
        res.status(500).send({ message: 'Internal server error', error: err }); // Send full error
    }
});

app.put("/freshattSfmUpdate", async (req, res) => {
    const { updates, remarks } = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, classAttendancePer]) => {
            const remark = remarks[registerNo];

            // Check if the registerNo exists in RenewalModel
            const renewalUser = await RenewalModel.findOne({ registerNo });
            if (renewalUser) {
                // Update RenewalModel only
                return RenewalModel.findOneAndUpdate(
                    { registerNo },
                    { classAttendancePer, classAttendanceRem: remark },
                    { new: true }
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    { registerNo },
                    { classAttendancePer, classAttendanceRem: remark },
                    { new: true }
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put("/freshdeeniyathUpdate", async (req, res) => {
    const { updates, remarks } = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, deeniyathPer]) => {
            const remark = remarks[registerNo];

            // Check if the registerNo exists in RenewalModel
            const renewalUser = await RenewalModel.findOne({ registerNo });
            if (renewalUser) {
                // Update RenewalModel only
                return RenewalModel.findOneAndUpdate(
                    { registerNo },
                    { deeniyathPer, deeniyathRem: remark },
                    { new: true }
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    { registerNo },
                    { deeniyathPer, deeniyathRem: remark },
                    { new: true }
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put("/freshsemUpdate", async (req, res) => {
    const { updates, remarks, arrears } = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, semPercentage]) => {
            const remark = remarks[registerNo];
            const arrear = arrears[registerNo];

            // Check if the registerNo exists in RenewalModel
            const renewalUser = await RenewalModel.findOne({ registerNo });
            if (renewalUser) {
                // Update RenewalModel
                return RenewalModel.findOneAndUpdate(
                    { registerNo },
                    { semPercentage, semRem: remark, arrear },
                    { new: true }
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    { registerNo },
                    { semPercentage, semRem: remark, arrear },
                    { new: true }
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get("/renewal", (req, res) => {
    RenewalModel.find()
        .then(users => {
            const usersWithFileURL = users.map(user => ({
                ...user._doc,
                jamath: user.jamath ? `${req.protocol}://${req.get('host')}/${user.jamath.replace(/\\/g, '/')}` : null
            }));
            res.json(usersWithFileURL);
        })
        .catch(err => res.json(err));
})
app.get('/in-progress', async (req, res) => {
    try {
        const inProgressApplicants = await ApplicantModel.find({ action: 0 });
        res.json(inProgressApplicants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/admin/studentstatus', async (req, res) => {
    const { registerNo, mobileNo } = req.body;

    try {
        const status = await ApplicantModel.findOne({ registerNo: registerNo });

        if (status) {
            if (status.mobileNo === mobileNo) {
                res.json({ status: "exist", action: status.action });
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

app.put('/api/admin/donar/:id', (req, res) => {
    const donorId = req.params.id;
    // Handle the PUT request here
    res.send(`Donor ${donorId} updated successfully`);
});

app.post('/api/admin/student/update', async (req, res) => {
    try {
        const { registerNo } = req.body;

        const update = await ApplicantModel.findOneAndUpdate({ registerNo }, req.body, { new: true });

        if (update) {
            res.json(update);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


app.listen(3001, () => {
    console.log("Server is Running")
})