const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"users"

    },
    caseId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'cases'
    },
    
    date: {
        type: Date,
        required: true,

    },
    status: {
        type: String,
default:'pending'
    },
        advocateId:{
            type:mongoose.Schema.Types.ObjectId,
            default:null,
            ref:'advocates'
        }

});
module.exports = mongoose.model('appointmentReqs', appSchema)

