const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ApplicantSchema = new mongoose.Schema({
    appno :  Number,
    fresherOrRenewal : String,
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
    schoolName : String,
    yearOfPassing : Number,
    percentageOfMarkSchool : Number,
    semPercentage : Number,
    deeniyathPer : Number,
    classAttendancePer : Number,
    siblings : String
})

/*const RenewalSchema = new mongoose.Schema({
    appno :  Number,
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
    mark : Number,
    percentage : Number,
    classAttendance : Number,
    classAttendancePer : Number,
    deeniyathEducationDays : Number,
    deeniyathattPer : Number,
    siblings : Number,
    arrear : Number,
    lastCreditedAmt : Number
})*/

//Apply the auto increment because using application No.
ApplicantSchema.plugin(AutoIncrement, { inc_field: 'appno' });

const ApplicantModel = mongoose.model("applicant", ApplicantSchema)
module.exports = ApplicantModel
//const RenewalModel = mongoose.model("renewal", RenewalSchema)
/*module.exports = RenewalModel*/