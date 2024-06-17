const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ApplicantSchema = new mongoose.Schema({
    appno :  Number,
    regno : String,
    name : String,
    ugorpg : String,
    procat : String,
    sem : String,
    hostelers : String,
    dept : String,
    section : String,
    splcat : String,
    religion : String,
    community : String,
    mobno : Number,
    email : String,
    aadhar : Number,
    fatname : String,
    fatno : Number,
    fatocc : String,
    fatinc : Number,
    address : String,
    district : String,
    state : String,
    pincode : Number,
    schoolname: String,
    yopassing : Number,
    schoolmark : Number,
    schoolpercent : Number,
    semmark : Number,
    sempercentage : Number,
    clsattend : Number,
    clsattper : Number,
    deeniyathattend : Number,
    deeniyathattper : Number,
    siblings : Number
})

//Apply the auto increment because using application No.
ApplicantSchema.plugin(AutoIncrement, { inc_field: 'appno' });

const ApplicantModel = mongoose.model("applicant", ApplicantSchema)
module.exports = ApplicantModel