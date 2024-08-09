const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ApplicantSchema = new mongoose.Schema({
    appno :  Number,
    acyear : String,
    fresherOrRenewal : {
        type: String,
        default : 'Fresher'
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
    //community : String,
    hostel : String,
    mobileNo : Number,
    emailId : String,
    aadhar : Number,
    fatherName : String,
    fatherNo : Number,
    fatherOccupation : String,
    annualIncome : String,
    schoolName : { type: String, default: 'null' },
    yearOfPassing : { type: Number, default: 0 },
    percentageOfMarkSchool : { type: Number, default: 0 },
    preSemester : String,
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
    arrear : {
        type: Number,
        default: 0
    },
    siblings : String,
    attendance : String,
    deeniyath : String,
    hostelrep : String,
    reason : String,
    siblingsNo : { type: Number, default: 0 },
    siblingsOccupation : String,
    siblingsIncome : { type: Number, default: 0 },
    jamath: String,
    action: {
        type: Number,
        default: 0
    },
    password: String,
})

//Apply the auto increment because using application No.
ApplicantSchema.plugin(AutoIncrement, { inc_field: 'appno' });

const ApplicantModel = mongoose.model("applicant", ApplicantSchema)
module.exports = ApplicantModel
//const RenewalModel = mongoose.model("renewal", RenewalSchema)
/*module.exports = RenewalModel*/