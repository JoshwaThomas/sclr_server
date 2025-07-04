const mongoose = require('mongoose')

const DonarSchema = new mongoose.Schema({
    acyear: String,
    did: String,
    pan: String,
    name: String,
    mobileNo: Number,
    emailId: String,
    address: String,
    district: String,
    state: String,
    pin: Number,
    donordept: String,
    donorbatch: String,
    scholtype: String,
    amount: Number,
    zakkathamt: Number,
    zakkathbal: Number,
    balance: Number,
    scholdate: String,
    date: String,
})

const DonarModel = mongoose.model("donar", DonarSchema)
module.exports = DonarModel