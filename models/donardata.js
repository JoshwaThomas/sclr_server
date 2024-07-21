const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const DonarDataSchema = new mongoose.Schema({
    did :  String,
    acyear : String,
    pan : String,
    name : String,
    mobileNo : Number,
    emailId : String,  
    address : String,
    district : String,
    state : String,
    pin : Number,
    scholtype : String,
    amount: Number,
    scholdate: String, 
})


// DonarDataSchema.plugin(AutoIncrement, { inc_field: 'donarId' });

const DonarDataModel = mongoose.model("donardata", DonarDataSchema)
module.exports = DonarDataModel


