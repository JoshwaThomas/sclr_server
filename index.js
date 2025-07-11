require('dotenv').config();
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
const DateMang = require('./routes/datemang')
const AcademicModel = require('./models/academic')
// const bcrypt = require('bcryptjs');

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
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
app.use('/api/admin', DateMang);



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./zamathfiles");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});
const upload = multer({storage: storage});







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

// worked adminside stu update
// app.post('/api/admin/student/update', async (req, res) => {
//     try {
//         const { registerNo } = req.body;

//         const update = await ApplicantModel.findOneAndUpdate({ registerNo }, req.body, { new: true });

//         if (update) {
//             res.json(update);
//         } else {
//             res.status(404).json({ message: 'Student not found' });
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

app.post("/api/forgotpass", async (req, res) => {
    const {registerNo, mobileNo, aadhar, password} = req.body;
    console.log('front: ', registerNo, mobileNo, aadhar, password)
    try {
        const register = await ApplicantModel.findOne({registerNo});

        if (register) {
            console.log(register)
            console.log("request mobileNo", mobileNo)
            console.log("DB mobileNo", register.mobileNo)
            if (mobileNo == register.mobileNo) {
                console.log("mobile Number matched", register.mobileNo)
                console.log("request Aadhar", aadhar)
                if (aadhar == register.aadhar) {
                    console.log("Aadhar Number matched", register.aadhar)
                    // const hashedPassword = bcrypt.hashSync(password, 10);
                    await ApplicantModel.findOneAndUpdate(
                        {registerNo},
                        {password: password}
                    );
                    res.status(200).json({success: true, message: "Password updated successfully!"});
                } else {
                    res.status(200).json({message: 'Aadhar number mismatched'});
                }
            } else {
                res.status(200).json({message: 'Mobile number mismatched'});
            }
        } else {
            res.status(200).json({message: 'Register number not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

app.post("freshaction/:registerNo", (req, res) => {
    const {registerNo} = req.body;
    ApplicantModel.findOneAndUpdate({registerNo}, req.body, {new: true})
        .then(users => res.json({success: true, users}))
        .catch(err => res.json({success: false, error: err}));

})
app.post("/api/admin/action", async (req, res) => {
    const {registerNo} = req.body;

    try {
        const acyearData = await AcademicModel.findOne({active: '1'})
        const curAcyear = acyearData.acyear;
        console.log(curAcyear)
        const register = await RenewalModel.findOne({registerNo, acyear: curAcyear});
        console.log(register)
        if (!register) {
            const result = await ApplicantModel.findOneAndUpdate(
                {registerNo},
                {action: '1'},
                {new: true}
            );
            return res.json({success: true, result});
        } else {
            const result = await RenewalModel.findOneAndUpdate(
                {registerNo, acyear: curAcyear},
                {action: '1'},
                {new: true}
            );
            console.log('Updated Renewal Record:', result);
            return res.json({success: true, result});
        }
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
})
app.post("/api/admin/actionreject", async (req, res) => {
    const {registerNo} = req.body;
    try {
        const acyearData = await AcademicModel.findOne({active: '1'})
        const curAcyear = acyearData.acyear;
        console.log(curAcyear)
        const register = await RenewalModel.findOne({registerNo, acyear: curAcyear});

        if (!register) {
            const result = await ApplicantModel.findOneAndUpdate(
                {registerNo},
                {action: '2'},
                {new: true}
            );
            return res.json({success: true, result});
        } else {
            const result = await RenewalModel.findOneAndUpdate(
                {registerNo, acyear: curAcyear},
                {action: '1'},
                {new: true}
            );
            console.log('Updated Renewal Record:', result);
            return res.json({success: true, result});
        }
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
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

//get the student details for using renewal form and check the amount table bcz once fresher recive the amt then apply renewal
// app.get('/api/admin/students', async (req, res) => {
//     const { registerNo } = req.query;
//     console.log(`Received request for registerNo: ${registerNo},`);
//     try {
//         // Find the student by registerNo and mobileNo
//         const student = await ApplicantModel.findOne({ registerNo: registerNo });

//         if (!student) {
//             console.log('Student not found');
//             return res.status(404).send('Student with the specified Register No and not found');
//         }
//         const acyearData = await AcademicModel.findOne({ active: '1' });
//         console.log(acyearData)
//         if (!acyearData) {
//             return res.status(404).send('Active academic year not found');
//         }
//         const currentAcyear = acyearData.acyear;
//         console.log('currentAcyear', currentAcyear)
//         const [startYear, endYear] = currentAcyear.split('-').map(Number);
//         const previousAcyear = `${startYear - 1}-${endYear - 1}`;
//         console.log(previousAcyear)

//         const amounts = await AmountModel.find({ registerNo, acyear: previousAcyear });
//         const totalScholamt = amounts.reduce((sum, entry) => sum + entry.scholamt, 0);

//         // Combine student data with the total scholamt and send the response
//         const response = { ...student.toObject(), scholamt: totalScholamt };
//         res.json(response);
//     }
//     catch (err) {
//         console.error('Error fetching student data:', err); // Detailed logging
//         res.status(500).send({ message: 'Internal server error', error: err }); // Send full error
//     }
// });


app.put("/freshdeeniyathUpdate", async (req, res) => {
    const {updates, remarks} = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, deeniyathPer]) => {
            const remark = remarks[registerNo];

            // Check if the registerNo exists in RenewalModel
            const academic = await AcademicModel.findOne({active: '1'});

            const renewalUser = await RenewalModel.findOne({registerNo,acyear: academic.acyear});
            if (renewalUser) {
                // Update RenewalModel only
                return RenewalModel.findOneAndUpdate(
                    {registerNo,acyear: academic.acyear},
                    {deeniyathPer, deeniyathRem: remark},
                    {new: true}
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    {registerNo,acyear: academic.acyear},
                    {deeniyathPer, deeniyathRem: remark},
                    {new: true}
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({success: true});
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({success: false, error: err.message});
    }
});

app.put("/freshsemUpdate", async (req, res) => {
    const {updates, remarks, arrears} = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, semPercentage]) => {
            const remark = remarks[registerNo];
            const arrear = arrears[registerNo];

            // Check if the registerNo exists in RenewalModel
            const renewalUser = await RenewalModel.findOne({registerNo});
            if (renewalUser) {
                // Update RenewalModel
                return RenewalModel.findOneAndUpdate(
                    {registerNo},
                    {semPercentage, semRem: remark, arrear},
                    {new: true}
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    {registerNo},
                    {semPercentage, semRem: remark, arrear},
                    {new: true}
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({success: true});
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({success: false, error: err.message});
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
        const inProgressApplicants = await ApplicantModel.find({action: 0});
        res.json(inProgressApplicants);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});



app.get('/api/admin/studentdata', async (req, res) => {
    try {
        const students = await ApplicantModel.find();
        const academic = await AcademicModel.findOne({active: '1'});
        res.json({students, academic});
    } catch (err) {
        console.log('error', err);
        res.status(500).json({message: 'Internal Server Error'});
    }
});


app.post('/api/admin/studentstatus', async (req, res) => {
    const {registerNo, mobileNo} = req.body;

    try {
        const status = await ApplicantModel.findOne({registerNo: registerNo});

        if (status) {
            if (status.mobileNo === mobileNo) {
                res.json({status: "exist", action: status.action});
            } else {
                res.json({status: "wrong password"});
            }
        } else {
            res.json({status: 'not exist'});
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

app.put('/api/admin/donar/:id', (req, res) => {
    const donorId = req.params.id;
    res.send(`Donor ${donorId} updated successfully`);
});






















































// ----------------------------------------------------------------------------------------------------------------

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});

// ----------------------------------------------------------------------------------------------------------------

// Fetch Student Details for Application Menu after Login

app.get('/api/admin/students', async (req, res) => {

    const {registerNo} = req.query;

    try {

        const acyearData = await AcademicModel.findOne({active: '1'});
        if (!acyearData) {return res.status(404).send('Active academic year not found');}
        const currentAcyear = acyearData.acyear;
        const [startYear, endYear] = currentAcyear.split('-').map(Number);
        const previousAcyear = `${startYear - 1}-${endYear - 1}`;
        const amounts = await AmountModel.find({registerNo, acyear: previousAcyear});
        const totalScholamt = amounts.reduce((sum, entry) => sum + entry.scholamt, 0);

        let student;

        if (registerNo) {
            const fresherData = await ApplicantModel.findOne({registerNo, acyear: currentAcyear});
            const renewalData = await RenewalModel.findOne({registerNo, acyear: currentAcyear});
            if (fresherData || renewalData) {
                student = (fresherData || renewalData).toObject();
            }
            else {
                const prevfresherData = await ApplicantModel.findOne({registerNo, acyear: previousAcyear});
                const prevrenewalData = await RenewalModel.findOne({registerNo, acyear: previousAcyear});
                if (prevfresherData) {student = {...prevfresherData.toObject(), semester: ''}}
                else {student = {...prevrenewalData.toObject(), semester: ''}}
            }
        }

        if (!student) {return res.status(404).send('Student with the specified Register No not found')}

        let studentType = ''; let showOrBlock = 'block';

        const amountExists = await AmountModel.exists({registerNo: registerNo});

        if (amountExists) {
            studentType = 'Renewal';
            const renewalData = await RenewalModel.findOne({registerNo: registerNo, acyear: currentAcyear});
            if (renewalData) {showOrBlock = 'block'}
            else {showOrBlock = 'show'}
        } else {
            studentType = 'Fresher';
            const fresherData = await ApplicantModel.findOne({registerNo: registerNo, acyear: currentAcyear});
            if (fresherData) {showOrBlock = 'block'}
            else {showOrBlock = 'show'}
        }

        const response = {
            ...student, scholamt: totalScholamt, studentType: studentType, showOrBlock: showOrBlock
        }
        res.json(response);
    }
    catch (err) {
        console.error('Error fetching Student Data : ', err);
        res.status(500).send({message: 'Internal server error', error: err});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// For Renewal Apply and also show details for Fresher

app.post("/renewal", upload.single("jamath"), async (req, res) => {

    const {registerNo, studentType} = req.body;
    const siblingsNo = req.body.siblingsNo && !isNaN(req.body.siblingsNo) ? Number(req.body.siblingsNo) : null;
    const siblingsIncome = req.body.siblingsIncome && !isNaN(req.body.siblingsIncome) ? Number(req.body.siblingsIncome) : null;
    const applicantData = {...req.body, siblingsNo, siblingsIncome, jamath: req.file ? req.file.path : null};

    try {

        const defaultZeroFields = ['semPercentage', 'deeniyathPer', 'prevAttendance', 'classAttendancePer'];
        defaultZeroFields.forEach(field => {
            if (
                applicantData[field] === undefined ||
                applicantData[field] === '' ||
                applicantData[field] === null ||
                applicantData[field] === 'undefined' ||
                isNaN(applicantData[field])
            ) {
                applicantData[field] = 0;
            } else {
                applicantData[field] = Number(applicantData[field]);
            }
        })

        if (studentType === 'Fresher') {
            const acyearData = await AcademicModel.findOne({active: '1'});
            if (!acyearData) return res.status(404).send('Active academic year not found');
            const [startYear, endYear] = acyearData.acyear.split('-').map(Number);
            const previousAcyear = `${startYear - 1}-${endYear - 1}`;
            const missingObject = await ApplicantModel.findOne({registerNo, acyear: previousAcyear});

            if (missingObject) {

                const fieldsToCarryForward = [
                    'schoolName', 'yearOfPassing', 'percentageOfMarkSchool', 'semPercentage', 'deeniyathPer',
                    'prevAttendance', 'classAttendancePer', 'classAttendanceRem', 'deeniyathRem',
                    'semRem', 'arrear', 'attendance', 'scholarship', 'password', 'hostelrep', 'reason'
                ]

                fieldsToCarryForward.forEach(field => {
                    if (
                        applicantData[field] === undefined ||
                        applicantData[field] === '' ||
                        applicantData[field] === null ||
                        applicantData[field] === 'undefined'
                    ) {
                        applicantData[field] = missingObject[field] ??
                            (ApplicantModel.schema.paths[field]?.defaultValue instanceof Function
                                ? ApplicantModel.schema.paths[field].defaultValue() : ApplicantModel.schema.paths[field]?.defaultValue ?? ''
                            )
                    }
                })
            }

            applicantData.acyear = acyearData.acyear;
            const created = await ApplicantModel.create(applicantData);
            return res.status(201).json({success: true, code: "FRESHER_SUCCESS", user: created});

        } else {

            const acyearData = await AcademicModel.findOne({active: '1'});
            if (!acyearData) return res.status(404).send('Active academic year not found');

            applicantData.acyear = acyearData.acyear;
            const fresherExists = await ApplicantModel.findOne({registerNo, acyear: acyearData.acyear});

            if (fresherExists) {
                return res.status(409).json({success: false, code: "FRESHER_EXISTS", message: "Already You Applied Fresher Application"});
            }
            const renewalExists = await RenewalModel.findOne({registerNo, acyear: acyearData.acyear});
            if (renewalExists) {
                return res.status(409).json({success: false, code: "RENEWAL_EXISTS", message: "Already You Applied Renewal Application"});
            }
            const created = await RenewalModel.create(applicantData);
            return res.status(201).json({success: true, code: "RENEWAL_SUCCESS", user: created});
        }
    } catch (error) {
        console.error("Renewal Submission Error : ", error);
        return res.status(500).json({success: false, code: "SERVER_ERROR", message: error.message});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// Fresh Application Submission through Application in Register Menu 

app.post("/fresh", upload.single("jamath"), async (req, res) => {

    try {

        const {registerNo} = req.body;
        const yearOfPassing = req.body.yearOfPassing && req.body.yearOfPassing !== "undefined" ? Number(req.body.yearOfPassing) : null;
        const siblingsNo = req.body.siblingsNo && req.body.siblingsNo !== "undefined" ? Number(req.body.siblingsNo) : null;
        const siblingsIncome = req.body.siblingsIncome && req.body.siblingsIncome !== "undefined" ? Number(req.body.siblingsIncome) : null;

        const applicantData = {
            ...req.body, yearOfPassing, siblingsNo, siblingsIncome,
            jamath: req.file ? req.file.path : null,
        };

        const existingUser = await ApplicantModel.findOne({registerNo});

        if (existingUser) {return res.json({success: false, message: "Register No. Already Existing"})}

        const newUser = await ApplicantModel.create(applicantData);
        return res.json({success: true, user: newUser});

    } catch (err) {
        console.error("Error during Fresh Application Submission : ", err);
        return res.status(500).json({success: false, message: "Internal server error", error: err});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// To check Register Number Existing or not for Register Application

app.get('/checkRegister', async (req, res) => {

    const {registerNumber} = req.query;

    try {
        const existingApplicant = await ApplicantModel.findOne({registerNo: registerNumber});
        if (existingApplicant) {return res.json({message: 'ExistingStudent'})}
        else {return res.json({message: 'NewStudent'})}
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: 'Server Error'});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// Student Details Update for Admin

app.post('/api/admin/student/update', upload.single("jamath"), async (req, res) => {

    try {

        const {registerNo, fresherOrRenewal} = req.body;
        const classAttendancePer = req.body.classAttendancePer && req.body.classAttendancePer !== "undefined" ? Number(req.body.classAttendancePer) : null;
        const deeniyathPer = req.body.deeniyathPer && req.body.deeniyathPer !== "undefined" ? Number(req.body.deeniyathPer) : null;
        const semPercentage = req.body.semPercentage && req.body.semPercentage !== "undefined" ? Number(req.body.semPercentage) : null;
        const percentageOfMarkSchool = req.body.percentageOfMarkSchool && req.body.percentageOfMarkSchool !== "undefined" ? Number(req.body.percentageOfMarkSchool) : null;
        const yearOfPassing = req.body.yearOfPassing && req.body.yearOfPassing !== "undefined" ? Number(req.body.yearOfPassing) : null;
        const siblingsNo = req.body.siblingsNo && !isNaN(req.body.siblingsNo) ? Number(req.body.siblingsNo) : null;
        const siblingsIncome = req.body.siblingsIncome && !isNaN(req.body.siblingsIncome) ? Number(req.body.siblingsIncome) : null;

        const updatedFields = {
            ...req.body, classAttendancePer, deeniyathPer, semPercentage,
            percentageOfMarkSchool, yearOfPassing, siblingsNo, siblingsIncome,
        };

        if (req.file) {updatedFields.jamath = req.file.path}

        const academic = await AcademicModel.findOne({active: 1});
        const ModelToUse = fresherOrRenewal === 'Fresher' ? ApplicantModel : RenewalModel;

        const update = await ModelToUse.findOneAndUpdate(
            {registerNo, acyear: academic.acyear}, {$set: updatedFields}, {new: true}
        )

        if (update) {res.json({update, success: true})}
        else {res.status(404).json({message: 'Student not found'})}

    } catch (err) {
        console.error("Error in updating a Student :", err);
        res.status(500).json({message: 'Failed to update student information', error: err});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// For AIDED , SFM , SFW attendance


app.put("/freshattSfmUpdate", async (req, res) => {
    const {updates, remarks} = req.body;

    try {
        const updatePromises = Object.entries(updates).map(async ([registerNo, attendanceData]) => {
            const {prevAttendance, classAttendancePer} = attendanceData;
            const remark = remarks[registerNo];

            // Check if the registerNo exists in RenewalModel
            const academic = await AcademicModel.findOne({active: '1'});
            // console.log(academic.acyear)

            const renewalUser = await RenewalModel.findOne({
                registerNo, acyear: academic.acyear
            });

            // console.log(renewalUser)


            if (renewalUser) {
                // Update RenewalModel only
                return RenewalModel.findOneAndUpdate(
                    {registerNo, acyear: academic.acyear},
                    {prevAttendance, classAttendancePer, classAttendanceRem: remark},
                    {new: true}
                );
            } else {
                // If not in RenewalModel, update ApplicantModel
                return ApplicantModel.findOneAndUpdate(
                    {registerNo, acyear: academic.acyear},
                    {prevAttendance, classAttendancePer, classAttendanceRem: remark},
                    {new: true}
                );
            }
        });

        await Promise.all(updatePromises);

        res.json({success: true});
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({success: false, error: err.message});
    }
});
