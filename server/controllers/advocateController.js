const Advocate = require('../models/advocateModel');

const multer = require("multer");
const user=require('../models/userModel')


const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    const uniquePrefix = 'prefix-'; 
    const originalname = file.originalname;
    const extension = originalname.split('.').pop();
    const filename = uniquePrefix + originalname.substring(0, originalname.lastIndexOf('.')) + '-' + Date.now() + '.' + extension;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage }).fields([
    { name: 'profilePic', maxCount: 1 },  // For Profile Picture
    { name: 'idProof', maxCount: 1 }      // For ID Proof
  ]);

const uploadProfile = multer({ storage: storage }).single('profilePic');

// Register Advocate
const registerAdvocate = async (req, res) => {
    try {
        const { fname,lname, bcNo, contact, email, password, experience, dob,specialization } = req.body;

        const profilePic = req.files.profilePic[0]
        const idProof = req.files.idProof[0]

        const newAdvocate = new Advocate({
            name:fname+" "+lname,
            bcNo,
            
            contact,
            email,
            password,
           
            
            experience,
            
            dob,
            experience,
           
            specialization,
            idProof:idProof,
            profilePic:profilePic
        });
        let existingAdvocate3 = await Advocate.findOne({ email });
        
        let existingAdvocate5 = await user.findOne({ email });

        let existingAdvocate = await Advocate.findOne({ bcNo });
        let existingAdvocate2 = await Advocate.findOne({ contact });
        if (existingAdvocate) {
            return res.json({
                status: 409,
                msg: "BarCouncil Enrollment Number Already Registered With Us !!",
                data: null
            });
        }
        else if(existingAdvocate2) {
            return res.json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }   else if(existingAdvocate3||existingAdvocate5) {
            return res.status(409).json({
                status: 409,
                msg: "Email Already Registered With Us !!",
                data: null
            });
        }
        await newAdvocate.save()
            .then(data => {
                return res.status(200).json({
                    status: 200,
                    msg: "Inserted successfully",
                    data: data
                });
            })
            .catch(err => {
                console.log(err);

                if (err.code === 11000) {
                    return res.status(409).json({
                        status: 409,
                        msg: "Email already in use",
                        data: err
                    });
                }
                return res.status(500).json({
                    status: 500,
                    msg: "Data not Inserted",
                    data: err
                });
            });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error.message });
    }
};

// View all advocates
const viewAdvocates = (req, res) => {
    Advocate.find({adminApproved:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained",
                    data:[]
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};
const viewActiveAdvocates = (req, res) => {
    Advocate.find({isActive:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained",
                    data:[]
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// View all advocates
const viewAdvocatesBySpecializn = (req, res) => {
    Advocate.find({specialization:req.body.specialization}).sort({rating:-1}).limit(5)
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};

// View all advocate Reqs
const viewAdvocateReqs = (req, res) => {
    Advocate.find({adminApproved:false})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const approveAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{adminApproved:true,isActive:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const activateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{isActive:true})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// approve Advocate
const deactivateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({_id:req.params.id},{isActive:false})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data obtained successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};


// reject Advocate
const rejectAdvocateById = (req, res) => {
    Advocate.findByIdAndDelete({_id:req.params.id})
        .exec()
        .then(data => {
            if (data.length > 0) {
                res.json({
                    status: 200,
                    msg: "Data Removed successfully",
                    data: data
                });
            } else {
                res.json({
                    status: 200,
                    msg: "No Data obtained"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not obtained",
                Error: err
            });
        });
};

// Update advocate by ID
const editAdvocateById = async (req, res) => {
    const { name, bcNo, bcState, contact, email, password, gender, address, experience, nationality, qualification, dob, professionalExperience, dateOfEnrollment, specialization } = req.body;
console.log("profilePic",req.body.filename);
    Advocate.findByIdAndUpdate({ _id: req.params.id }, {
        name,
        bcNo,
        
        contact,
        email,
        password,
        gender,
        address,
        experience,
       
        dob,
        professionalExperience,
        
        specialization,
        profilePic:req.file
    })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Updated successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });
};

// View advocate by ID
const viewAdvocateById = (req, res) => {
    console.log(req.params.id );
    
    Advocate.findById({ _id: req.params.id })
        .exec()
        .then(data => {
            console.log(data);
            
            res.status(200).json({
                status: 200,
                msg: "Data obtained successfully",
                data: data
            });
        })
        .catch(err => {
            console.log(err);
            
            res.status(500).json({
                status: 500,
                msg: "No Data obtained",
                Error: err
            });
        });
};

// Delete advocate by ID
const deleteAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id },{isActive:'inactive'})
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data removed successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "No Data obtained",
                Error: err
            });
        });
};

// Forgot Password for advocate
const forgotPassword =async (req, res) => {

    let userData=null,type="nil"
   const adv= await Advocate.findOne({email: req.body.email })


    const user=await user.findOne({  email: req.body.email })

    if(adv){
    Advocate.findOneAndUpdate({ email: req.body.email }, {
        password: req.body.password
    })
        .exec()
        .then(data => {
            if (data != null)
                res.json({
                    status: 200,
                    msg: "Updated successfully"
                });
            else
                res.json({
                    status: 500,
                    msg: "User Not Found"
                });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });

}else{
    res.status(405).json({
        status: 405,
        msg: "User Not Found"
    })
}
}
// Reset Password for advocate
const resetPassword = async (req, res) => {
    let pwdMatch = false;

    await Advocate.findById({ _id: req.params.id })
        .exec()
        .then(data => {
            if (data.password === req.body.oldpassword)
                pwdMatch = true;
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });

    if (pwdMatch) {
        await Advocate.findByIdAndUpdate({ _id: req.params.id }, {
            password: req.body.newpassword
        })
            .exec()
            .then(data => {
                if (data != null)
                    res.json({
                        status: 200,
                        msg: "Updated successfully"
                    });
                else
                    res.json({
                        status: 500,
                        msg: "User Not Found"
                    });
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    msg: "Data not Updated",
                    Error: err
                });
            });
    } else {
        res.json({
            status: 405,
            msg: "Your Old Password doesn't match"
        });
    }
};

//advocate login

// Login User
const login = (req, res) => {
    const { email, password } = req.body;

    Advocate.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
console.log(user);

        if (user.password !== password) {
            return res.status(403).json({ msg: 'Password Mismatch !!' });
        }

        if (!user.adminApproved) {
            return res.status(403).json({ msg: 'Please wait for Admin Approval !!' });
        } 
        if (!user.isActive) {
            return res.status(403).json({ msg: 'You are currently deactivated By Admin !!' });
        }

      

        res.json({
            status: 200,
            data: user,
           
        });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ msg: 'Something went wrong' });
    });
};


//

const addRating = (req, res) => {
    let newRate = parseInt(req.body.rating);
    let rating = 0;
    Advocate.findById({ _id: req.params.id })
      .exec()
      .then((data) => {
        rating = data.rating;
        if (data.rating != 0) rating = (rating + newRate) / 2;
        else rating = newRate;
        Advocate.findByIdAndUpdate(
          { _id: req.params.id },
          {
            rating: rating,
          },
          { new: true }
        )
          .exec()
          .then((data) => {
            res.json({
              status: 200,
              msg: "Data obtained successfully",
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
      });
  };
  
module.exports = {
    registerAdvocate,
    viewAdvocates,
    editAdvocateById,
    viewActiveAdvocates,
    viewAdvocateById,
    deleteAdvocateById,
    forgotPassword,
    resetPassword,
    login,
    upload,
    viewAdvocateReqs,
    approveAdvocateById,
    rejectAdvocateById,
    activateAdvocateById,
    deactivateAdvocateById,
    uploadProfile,
    viewAdvocatesBySpecializn,
    addRating
};
