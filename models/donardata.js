const mongoose = require('mongoose')

const DonarDataSchema = new mongoose.Schema({
    did: String,
    acyear: String,
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
    scholdate: String,
    receipt: String,
})

const DonarDataModel = mongoose.model("donardata", DonarDataSchema)
module.exports = DonarDataModel