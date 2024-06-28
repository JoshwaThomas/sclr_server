const mongoose = require('mongoose')

const AmountSchema = new mongoose.Schema({
    fresherOrRenewal : String,
    registerNo : String,
    name : String,
    dept : String,
    scholtype : String,
    scholdonar : String,
    scholamt : Number
})


const AmountModel = mongoose.model("amount", AmountSchema)
module.exports = AmountModel
