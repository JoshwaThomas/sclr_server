const mongoose = require('mongoose')

const StaffSchema = new mongoose.Schema({
    staffId :  String,
    name : String,
    role : Number,
    password : String,
})


const StaffModel = mongoose.model("staff", StaffSchema)
module.exports = StaffModel
