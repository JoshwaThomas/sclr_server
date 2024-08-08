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
    donordept : String,
    donorbatch : String,
    scholtype : String,
    amount: Number,
    zakkathamt: Number,
    scholdate: String, 
    receipt: String,
})


// DonarDataSchema.plugin(AutoIncrement, { inc_field: 'donarId' });

const DonarDataModel = mongoose.model("donardata", DonarDataSchema)
module.exports = DonarDataModel


