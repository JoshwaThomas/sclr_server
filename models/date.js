const mongoose = require('mongoose')

const DateSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,

})
const DateModel = mongoose.model("date", DateSchema)
module.exports = DateModel
