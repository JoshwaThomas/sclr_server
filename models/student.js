const mongoose = require('mongoose')



const StudentSchema = new mongoose.Schema({
    dept : String,
    registerNo : String,
    name : String,
    fatherName : String,
    dob: String,
    community : String,
    religion : String,
    mobileNo : Number,
    fatherNo : Number,
    procategory : String,
    section : String, 
    emailId : String,
    aadhar : Number
})



const StudentModel = mongoose.model("student", StudentSchema)
module.exports = StudentModel