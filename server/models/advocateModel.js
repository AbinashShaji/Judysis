const mongoose= require("mongoose");

const advSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    bcNo:{
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
    profilePic:{
        type:Object,
        required:true

    },
    
    specialization:{
        type:String,
        required:true

    },
    idProof:{
        type:Object,
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    },
    adminApproved:{
        type:Boolean,
        default:false
    }, rating:{
        type:Number,
        default:0
      },
      
},{timStamps:true});
module.exports=mongoose.model('advocates',advSchema)

