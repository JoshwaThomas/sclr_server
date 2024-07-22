const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);


const RenewalSchema = new mongoose.Schema({
    acyear : String,
    reappno :  Number,
    fresherOrRenewal : String,
    ugOrPg : String,
    semester : String,
    name : String,
    registerNo : String,
    dept : String,
    section : String,
    religion : String,
    procategory : String,
    address : String,
    district : String,
    state : String,
    pin : Number,
    specialCategory : String,
    community : String,
    hostel : String,
    mobileNo : Number,
    emailId : String,
    aadhar : Number,
    fatherName : String,
    fatherNo : Number,
    fatherOccupation : String,
    annualIncome : Number,
    preSemester: Number,
    semPercentage: Number,
    classAttendancePer : Number,
    deeniyathPer : Number,
    siblings : Number,
    arrear : Number,
    lastCreditedAmt : Number,
    
    secSem : Number,
    thirdSem : Number,
    fourSem : Number,
    fivSem : Number,
    sixSem : Number,
    secAmt : Number,
    thirdAmt : Number,
    fourAmt : Number,
    fivAmt : Number,
    sxAmt : Number,
    action: {
        type: Number,
        default: 0
    }

})

//Apply the auto increment because using application No.
RenewalSchema.plugin(AutoIncrement, { inc_field: 'reappno' });

const RenewalModel = mongoose.model("renewal", RenewalSchema)
module.exports = RenewalModel