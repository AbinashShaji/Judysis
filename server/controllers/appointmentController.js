const caseSchema = require('../models/caseModel');
const AppointmentReq = require('../models/appointmentSchema');

// Controller function to create a new appointment request
const createAppointment = async (req, res) => {
  const { userId, caseId,advocateId } = req.body;
  let flag=0
  await AppointmentReq.findOne({advocateId:advocateId,caseId:caseId}).then(data=>{
    console.log(data);
    if(data!=null)
    flag=1
   })
   console.log("fa",flag);
let date=new Date()
 
    const newAppointment = new AppointmentReq({
      userId: userId,
      caseId: caseId,
      advocateId:advocateId,
      date:date,
    
    });
if(flag==0){
    const savedAppointment = await newAppointment.save().then(savedAppointment=>{

    
    res.json({
      status: 200,
      msg: 'Appointment request created successfully',
      data: savedAppointment
    });
  }).catch (err=> {
    console.log(err);
        res.json({
      status: 500,
      msg: 'Failed to create appointment request',
      error: err.message
    });
  })
}
else{
  res.json({
    status: 500,
    msg: 'You have already send request to this Advocate'
  });
}
};

// Controller function to get all appointment requests
const getAppointmentReqsForAdv = async (req, res) => {
  try {
    
    
    const appointments = await AppointmentReq.find({advocateId:req.params.id,status:'pending'}).populate('userId').populate('caseId').populate('advocateId');
    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};

// Controller function to get all appointment requests
const getApprovedAppointmentsForAdv = async (req, res) => {
  try {
    const appointments = await AppointmentReq.find({advocateId:req.params.id,status:'accepted'}).populate('userId').populate('caseId');
    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};


// Controller function to get all appointment requests
const getAppointmentReqsByUserId = async (req, res) => {
    try {
      const appointments = await AppointmentReq.findById({_id:req.params.id}).populate('userId').populate('caseId');
      res.status(200).json({
        status: 200,
        msg: 'Appointments retrieved successfully',
        data: appointments
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        msg: 'Failed to retrieve appointments',
        error: err.message
      });
    }
  };
// Controller function to update an appointment request
const acceptReqbyAdv = async (req, res) => {

  let caseId=null,advocateId=null;

  try {
   await AppointmentReq.findById({_id:req.params.id}).then(data=>{
console.log(data.caseId);
 caseId=data.caseId
 advocateId=data.advocateId
    }).catch(err=>{
console.log(err);
    })
    const appointment = await AppointmentReq.findByIdAndUpdate({_id:req.params.id},{
      status:'accepted'}
    )
   
    if (!appointment) {
      return res.status(404).json({
        status: 404,
        msg: 'Appointment request not found'
      });
    }
    console.log("caseid",caseId._id);
    const cases = await caseSchema.findByIdAndUpdate({_id:caseId},{
      advocateStatus:true,approvalStatus:true,advocateId:advocateId}
    )
    res.json({
      status: 200,
      msg: 'Appointment request updated successfully',
      data: appointment
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      msg: 'Failed to update appointment request',
      error: err.message
    });
  }
};

const rejectReqbyAdv = async (req, res) => {
    try {
      const appointment = await AppointmentReq.findByIdAndUpdate({_id:req.params.id},{
        status:'rejected'}
      )
  
      if (!appointment) {
        return res.status(404).json({
          status: 404,
          msg: 'Appointment request not found'
        });
      }
  
      res.json({
        status: 200,
        msg: 'Appointment request updated successfully',
        data: appointment
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        msg: 'Failed to update appointment request',
        error: err.message
      });
    }
  };

// Controller function to get all appointment requests
const getAppointmentReqsById = async (req, res) => {
    try {
      const appointments = await AppointmentReq.findById({_id:req.params.id}).populate('userId').populate('caseId').populate('advocateId');
     console.log("app",appointments);
     
      res.status(200).json({
        status: 200,
        msg: 'Appointments retrieved successfully',
        data: appointments
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        msg: 'Failed to retrieve appointments',
        error: err.message
      });
    }
  };
module.exports = {
  createAppointment,
  getAppointmentReqsForAdv,
  getAppointmentReqsByUserId,
  acceptReqbyAdv,
rejectReqbyAdv,
getAppointmentReqsById,
getApprovedAppointmentsForAdv
};
