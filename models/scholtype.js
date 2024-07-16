const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ScholtypeSchema = new mongoose.Schema({
    stid :  Number,
    scholtype : String,
    
})
ScholtypeSchema.plugin(AutoIncrement, { inc_field: 'stid' });

const ScholtypeModel = mongoose.model("scholtype", ScholtypeSchema)
module.exports = ScholtypeModel
//const RenewalModel = mongoose.model("renewal", RenewalSchema)
/*module.exports = RenewalModel*/