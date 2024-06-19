const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ApplicantModel = require('./models/fersh')
const RenewalModel = require('./models/renewal')

const app = express()
app.use(cors({
    origin:"http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}))
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/sclr")

app.post("/fresh", (req, res) => {
    ApplicantModel.create(req.body)
    .then(users => res.json({ success: true, users }))
    .catch(err => res.json(err));
})

app.post("/renewal", (req, res) => {
    RenewalModel.create(req.body)
    .then(users => res.json({ success: true, users }))
    .catch(err => res.json({ success: false, error: err }));
})

app.get("/fresh", (req, res) => {
    ApplicantModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
})


app.listen(3001, () => {
    console.log("Server is Running")
})