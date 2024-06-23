const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ApplicantModel = require('./models/fersh')
const RenewalModel = require('./models/renewal')
const Student = require('./routes/freshstud')
const Dashboard = require('./routes/dashboard')
const Acyear = require('./routes/acyear')


const app = express()
app.use(cors({
    origin:"http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}))
app.use(express.json())
//Put reg.no. get the data freshform 
app.use('/api/students', Student);
app.use('/api/dashboard',Dashboard);
app.use('/api/admin', Acyear);

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

app.listen(3001, () => {
    console.log("Server is Running")
})