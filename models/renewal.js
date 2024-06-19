const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);


const RenewalSchema = new mongoose.Schema({
    reappno :  Number,
    fresherOrRenewal : String,
    registerNo : String,
    name : String,
    ugOrPg : String,
    proCategory : String,
    semester : String,
    hostel : String,
    dept : String,
    section : String,
    specialCategory : String,
    religion : String,
    community : String,
    mobileNo : Number,
    emailId : String,
    aadhar : Number,
    fatherName : String,
    fatherNo : Number,
    fatherOccupation : String,
    annualIncome : Number,
    address : String,
    district : String,
    state : String,
    pin : Number,
    preSemester: Number,
    classAttendance : Number,
    classAttendancePer : Number,
    deeniyathEducationDays : Number,
    deeniyathattPer : Number,
    siblings : Number,
    arrear : Number,
    lastCreditedAmt : Number
})

//Apply the auto increment because using application No.
RenewalSchema.plugin(AutoIncrement, { inc_field: 'reappno' });

const RenewalModel = mongoose.model("renewal", RenewalSchema)
module.exports = RenewalModel