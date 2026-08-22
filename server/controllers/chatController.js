const chat = require("../models/chatSchema");

const chatting = async (req, res) => {

  // Create a new message
  const message = new chat({
    msg: req.body.msg,
    from:req.body.from,
    to: req.body.to,
    advId: req.body.advId,
    userId: req.body.userId,
    internId: req.body.internId,
    jrId: req.body.jrId,
    caseId:req.body.caseId,
    date:new Date()
  });
  await message
    .save()

    .then((data) => {
      res.json({
        status: 200,
        msg: "Inserted successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};

const viewChatRecipientsforAdvocateById = (req, res) => {
  let uniqueUsers=[]
  chat
    .find({ advId: req.params.id })
    .populate("userId")
   

    .exec()
    .then((data) => {
      // console.log(data);
      if (data.length > 0) {
        let users = [],us=[]
        data.map((x) => {
          if(x.userId){
          users.push(x.userId);
          }
          
        

        });
        
        if(users.length>0)
         users = [...new Set(users)]
    

        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: users,
         
        });
      } else {
        res.json({
          status: 200,
          msg: "No Data obtained ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};
const viewChatRecipientsforUserId = (req, res) => {
  chat
    .find({ userId: req.params.id })
    .populate("advId")
    .exec()
    .then((data) => {
      if (data.length > 0) {
        adv = [];
        data.map((x) => {
          adv.push(x.advId);
        });
        const uniqueAdvs = [...new Set(adv)];
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: uniqueAdvs,
        });
      } else {
        res.json({
          status: 200,
          msg: "No Data obtained ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};
const viewChatBetweenUserAndAdv = (req, res) => {
  let advId = req.body.advId;
  let userId = req.body.userId;
  chat
    .find({
      // $or: [{
       advId: advId, userId: userId },
        // { rpid: parentid, parentid: rpid },
      // ],}
    )
    .sort({ date: 1 })
    .populate('advId')
    .populate('userId')
    .exec()
    
    .then((data) => {
      res.status(200).json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};
const viewChatBetweenAdvAndJr = (req, res) => {
  let advId = req.body.advId;
  let jrId = req.body.jrId;
  console.log("jid",jrId);
  chat
    .find({
      // $or: [{
       advId: advId, jrId: jrId },
        // { rpid: parentid, parentid: rpid },
      // ],}
    )
    .sort({ date: 1 })
    .populate('jrId')
    .populate('advId')
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

const viewChatBetweenInternAndAdv = (req, res) => {
  let advId = req.body.advId;
  let internId = req.body.internId;
  chat
    .find({
      // $or: [{
       advId: advId, internId: internId },
        // { rpid: parentid, parentid: rpid },
      // ],}
    )
    .sort({ date: 1 })
    .populate('internId')
    .populate('advId')
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
}; 
                                                                                                                                                                            
const viewChatBetweenUserAndJunior = (req, res) => {
  let jrId = req.body.jrId;
  let userId = req.body.userId;
  chat
    .find({
      // $or: [{
        userId: userId, jrId: jrId },
        // { rpid: parentid, parentid: rpid },
      // ],}
    )
    .sort({ date: 1 })
    .populate('jrId')
    .populate('userId')
    .exec()
    
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};


const checkIfJrInchat = (req, res) => {
  let userId = req.body.userId;
  let caseId = req.body.caseId;
let arr=[]
  chat
    .find({
      // $or: [{
        userId: userId,caseId:caseId},
        // { rpid: parentid, parentid: rpid },
      // ],}
    )
    .sort({ date: 1 })
    .populate('jrId')
    .populate('userId')
    .exec()
    
    .then((data) => {
      data.map(x=>{
        console.log(x);
if(x.from=="jradvocate"&&x.to=="user" )
  arr.push(x)
 if(x.from=="user"&&x.to=="jradvocate" )
   arr.push(x)

      })
      res.json({
        status: 200,
        msg: "got it successfully",
        data: arr,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};
module.exports = {
  chatting,
  viewChatRecipientsforAdvocateById,
  viewChatRecipientsforUserId,
  viewChatBetweenUserAndAdv,
  viewChatBetweenAdvAndJr,
  viewChatBetweenInternAndAdv,
  viewChatBetweenUserAndJunior,
  checkIfJrInchat
};
