const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AcademicSchema = new mongoose.Schema({
    acid: Number,
    acyear: String,
    active: { type: String,default: 0 }
})

AcademicSchema.plugin(AutoIncrement, { inc_field: 'acid' });

const AcademicModel = mongoose.model("academic", AcademicSchema)
module.exports = AcademicModel 