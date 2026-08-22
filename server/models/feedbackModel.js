const mongoose = require("mongoose");
const { Schema } = mongoose;
const fSchema = new Schema(
    {
       
      
            userId:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "users"
            
            },
            date:{
              type: Date,
              required: true,
            },
        
        feedback: {
            type: String,
            required:true

        }
    },{timestamps:true})
const feedback = mongoose.model("feedback", fSchema);
module.exports = feedback;