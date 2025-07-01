const mongoose = require('mongoose')

const AmountSchema = new mongoose.Schema({
    acyear: String,
    fresherOrRenewal: String,
    registerNo: String,
    name: String,
    dept: String,
    scholtype: String,
    scholdonar: String,
    scholamt: Number,
    amtdate: { type: Date, default: Date.now }
})

const AmountModel = mongoose.model("amount", AmountSchema)
module.exports = AmountModel