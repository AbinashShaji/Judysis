const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
    caseId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'cases'

    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"users"
    },
    
        advocateId:{
            type:mongoose.Schema.Types.ObjectId,
            default:null,
            ref:'advocates'

        }, judgeId:{
            type:mongoose.Schema.Types.ObjectId,
            default:null,
            ref:'judges'

        },
        status:{
            type:String,
         default:'Pending',
        },
        date:{
            type:Date,
        }, 
       hearingDate:{
            type:Date,
        }, 
        description:{
            type:String
        }

},
{ timestamps: true });
module.exports = mongoose.model('casestatus', statusSchema)

