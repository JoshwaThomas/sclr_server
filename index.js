const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ApplicantModel = require('./models/fersh')
const RenewalModel = require('./models/renewal')
const Student = require('./routes/freshstud')
const Dashboard = require('./routes/dashboard')
const Acyear = require('./routes/acyear')
const Donardetails = require('./routes/donardetails')
const Login = require('./routes/login')
const Amount = require('./routes/fershamt')


const app = express()
app.use(cors({
    origin:"http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}))

app.use(express.json())
//Put reg.no. get the data freshform 
app.use('/api/students', Student);
app.use('/api/dashboard',Dashboard);
app.use('/api/admin', Acyear);
app.use('/api/admin', Donardetails);
app.use('/api/admin', Login);
app.use('/api/admin', Amount);


mongoose.connect("mongodb://127.0.0.1:27017/sclr")

app.post("/fresh", (req, res) => {
    const { registerNo } = req.body;
    ApplicantModel.findOne({ registerNo })
    .then(existingUsers =>{
        
        //check the records for one more register
        if(existingUsers){
            return res.json({success: false, message: 'Register No. Already Existing'})
        }
        //new record created
        ApplicantModel.create(req.body)
        .then(users => res.json({ success: true, users }))
        .catch(err => res.json({success: false, error: err}))
    })
    .catch(err => res.json({success: false, error: err}))
    
})

app.post("/renewal", (req, res) => {
    const { registerNo } = req.body;
    //check the records for one more register
    RenewalModel.findOne({registerNo})
    .then(existingUsers =>{
        if(existingUsers) {
            return res.json({success: false, message: 'Register No. Already Existing'})
        }
    //create a new record
    RenewalModel.create(req.body)
    .then(users => res.json({ success: true, users }))
    .catch(err => res.json({ success: false, error: err }));
    })
    .catch(err => res.json({ success: false, error: err }));
    
})

app.get("/fresh", (req, res) => {
    ApplicantModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})

app.get("/renewal", (req,res) => {
    RenewalModel.find()
    .then(rusers => res.json(rusers))
    .catch(err => res.json(err));
})

app.post('/api/admin/status', async (req, res) => {
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



app.listen(3001, () => {
    console.log("Server is Running")
})