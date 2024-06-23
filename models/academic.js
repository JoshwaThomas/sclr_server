const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AcademicSchema = new mongoose.Schema({
    id :  Number,
    acyear : String,    
})
AcademicSchema.plugin(AutoIncrement, { inc_field: 'id' });

const AcademicModel = mongoose.model("academic", AcademicSchema)
module.exports = AcademicModel
//const RenewalModel = mongoose.model("renewal", RenewalSchema)
/*module.exports = RenewalModel*/