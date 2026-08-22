const mongoose= require("mongoose");

const advSchema=mongoose.Schema({


    name:{
        type:String,
        required:true,
    },
  
  
    contact:{
        type:Number,
        
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        dropDups: true
    },
  
    password:{
        type:String,
        required:true
    },
   
   
    experience:{
        type:Number,
        required:true

    },
   
    dob:{
        type:Date,
        required:true

    },
  
    
    specialization:{
        type:String,
        required:true

    },
   
    isActive:{
        type:Boolean,
        default:true
    } 
});
module.exports=mongoose.model('judges',advSchema)

