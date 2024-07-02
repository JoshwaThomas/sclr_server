const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const DonarSchema = new mongoose.Schema({
    donarId :  Number,
    name : String,
    mobileNo : Number,
    emailId : String,  
    address : String,
    district : String,
    state : String,
    pin : Number,
    scholtype : String,
    amount: Number,
    balance: Number,
    scholdate: String,
    date: String, 
})


DonarSchema.plugin(AutoIncrement, { inc_field: 'donarId' });

const DonarModel = mongoose.model("donar", DonarSchema)
module.exports = DonarModel
