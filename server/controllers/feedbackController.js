const feedback = require('../models/feedbackModel');

const addfeedback = (req, res) => {


  const feedback1 = new feedback({
    userId: req.body.userId,
    feedback: req.body.feedback,
    date: new Date()

  });

  feedback1.save()
    .then(data => {
      res.json({
        status: 200,
        message: "feedback added  successfully",
        data: data,
      }
      )
    })
    .catch(err => {
      console.log(err);
      
      console.error(err);
      res.json({
        err: err,
        status: 500,
      });
    })

}

const viewAllfeedbacks = (req, res) => {
  feedback.find()

    .populate('userId')
    .exec().
    then((feedbacks) => {
      res.status(200).json({
        status: 200,
        message: "feedbacks retrieved successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};


const deletefeedbackById = (req, res) => {
  feedback.findByIdAndDelete({ _id: req.params.id })
    .exec().
    then((feedbacks) => {
      res.json({
        status: 200,
        message: "feedbacks deleted successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};


const viewfeedbackById = (req, res) => {
  feedback.findById({ _id: req.params.id })
    .exec().
    then((feedbacks) => {
      res.json({
        status: 200,
        message: "feedbacks deleted successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};




module.exports = {
  addfeedback,
  viewAllfeedbacks,
  viewfeedbackById,

}
