const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ApplicantSchema = new mongoose.Schema({
    appno: Number,
    acyear: String,
    fresherOrRenewal: {
        type: String,
        default: 'Fresher'
    },
    scholarship: String,
    ugOrPg: String,
    semester: String,
    name: {
        type: String,
        required: true
    },
    registerNo: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    section: String,
    religion: String,
    procategory: String,
    address: String,
    district: String,
    state: String,
    pin: Number,
    specialCategory: String,
    hostel: String,
    mobileNo: {
        type: String,
        required: true
    },
    aadhar: Number,
    fatherName: String,
    fatherNo: Number,
    fatherOccupation: String,
    annualIncome: String,
    schoolName: { type: String, default: 'null' },
    yearOfPassing: { type: Number, default: 0 },
    percentageOfMarkSchool: { type: Number, default: 0 },
    preSemester: String,
    semPercentage: {
        type: Number,
        default: 0
    },
    deeniyathPer: {
        type: Number,
        default: 0
    },
    prevAttendance: {
        type: Number,
        default: 0
    },
    classAttendancePer: {
        type: Number,
        default: 0
    },
    classAttendanceRem: {
        type: String,
        default: 'Good'
    },
    deeniyathRem: {
        type: String,
        default: 'Good'
    },
    semRem: {
        type: String,
        default: 'Good'
    },
    arrear: {
        type: Number,
        default: 0
    },
    siblings: String,
    attendance: String,
    deeniyath: String,
    hostelrep: String,
    reason: String,
    siblingsNo: { type: Number, default: 0 },
    siblingsOccupation: String,
    siblingsIncome: { type: Number, default: 0 },
    jamath: {
        type: String,
        required: true
    },
    action: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
})

ApplicantSchema.plugin(AutoIncrement, { inc_field: 'appno' });

const ApplicantModel = mongoose.model("applicant", ApplicantSchema)
module.exports = ApplicantModel