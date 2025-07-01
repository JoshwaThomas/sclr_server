const mongoose = require('mongoose')

const RejectSchema = new mongoose.Schema({
    acyear: String,
    fresherOrRenewal: String,
    registerNo: String,
    name: String,
    dept: String,
    reason: String,
})

const RejectModel = mongoose.model("reject", RejectSchema)
module.exports = RejectModel