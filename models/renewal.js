const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);


const RenewalSchema = new mongoose.Schema({
    acyear : String,
    reappno :  Number,
    fresherOrRenewal : {
        type: String,
        default : 'Renewal'
    },
    ugOrPg : String,
    semester : String,
    name : String,
    registerNo : String,
    dept : String,
    section : String,
    religion : String,
    procategory : String,
    address : String,
    district : String,
    state : String,
    pin : Number,
    specialCategory : String,
    community : String,
    hostel : String,
    mobileNo : Number,
    emailId : String,
    aadhar : Number,
    fatherName : String,
    fatherNo : Number,
    fatherOccupation : String,
    annualIncome : Number,
    preSemester: Number,
    semPercentage : {
        type: Number,
        default: 0
    },
    deeniyathPer : {
        type: Number,
        default: 0
    },
    classAttendancePer :{
        type: Number,
        default: 0
    },
    classAttendanceRem :{
        type: String,
        default: 'Good'
    },
    deeniyathRem :{
        type: String,
        default: 'Good'
    },
    semRem :{
        type: String,
        default: 'Good'
    },
    siblings : String,
    siblingsNo : { type: Number, default: 0 },
    siblingsOccupation : String,
    siblingsIncome : { type: Number, default: 0 },
    arrear : {
        type: Number,
        default: 0
    },
    lastCreditedAmt : Number,
    jamath: String,
    action: {
        type: Number,
        default: 0
    }

})

//Apply the auto increment because using application No.
RenewalSchema.plugin(AutoIncrement, { inc_field: 'reappno' });

const RenewalModel = mongoose.model("renewal", RenewalSchema)
module.exports = RenewalModel