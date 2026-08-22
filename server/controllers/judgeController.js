const Judge = require('../models/judgeModel');

const user = require('../models/userModel');
const advocate = require('../models/advocateModel');


// Register Judge
const registerJudge= async (req, res) => {
    try {
        const { fname,lname,  contact, email, password, experience, dob,specialization } = req.body;

        
        const newJudge = new Judge({
            name:fname+" "+lname,
            
            
            contact,
            email,
            password,
           
            
            experience,
            
            dob,
            experience,
           
            specialization,
           
        });
        let existingJudge3 = await Judge.findOne({ email });
        
        let existingJudge5 = await user.findOne({ email });

        let existingJudge2 = await Judge.findOne({ contact });
        let existingJudge4 = await user.findOne({ email });
        let existingJudge6 = await advocate.findOne({ email });

    
         if(existingJudge2) {
            return res.json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }   else if(existingJudge3||existingJudge5||existingJudge4||existingJudge6) {
            return res.status(409).json({
                status: 409,
                msg: "Email Already Registered With Us !!",
                data: null
            });
        }
        await newJudge.save()
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

// View all Judges
const viewJudges = (req, res) => {
    Judge.find({})
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
const viewActiveJudges = (req, res) => {
    Judge.find({isActive:true})
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


// View all Judges
const viewJudgesBySpecializn = (req, res) => {
    Judge.find({specialization:req.body.specialization}).sort({rating:-1}).limit(5)
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




// approve Judge
const activateJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({_id:req.params.id},{isActive:true})
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


// approve Judge
const deactivateJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({_id:req.params.id},{isActive:false})
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


// reject Judge
const rejectJudgeById = (req, res) => {
    Judge.findByIdAndDelete({_id:req.params.id})
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

// Update Judge by ID
const editJudgeById = async (req, res) => {
    const { name, contact, email, password, gender,  experience,  dob,   specialization } = req.body;
console.log("profilePic",req.body.filename);
    Judge.findByIdAndUpdate({ _id: req.params.id }, {
        name,
       
        
        contact,
        email,
        password,
        gender,
       
        experience,
       
        dob,
     
        specialization,
        
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

// View Judge by ID
const viewJudgeById = (req, res) => {
    console.log(req.params.id );
    
    Judge.findById({ _id: req.params.id })
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

// Delete Judge by ID
const deleteJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({ _id: req.params.id },{isActive:'inactive'})
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

// Forgot Password for Judge
const forgotPassword =async (req, res) => {

    let userData=null,type="nil"
   const adv= await Judge.findOne({email: req.body.email })


    const user=await user.findOne({  email: req.body.email })

    if(adv){
    Judge.findOneAndUpdate({ email: req.body.email }, {
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
// Reset Password for Judge
const resetPassword = async (req, res) => {
    let pwdMatch = false;

    await Judge.findById({ _id: req.params.id })
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
        await Judge.findByIdAndUpdate({ _id: req.params.id }, {
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

//Judge login

// Login User
const login = (req, res) => {
    const { email, password } = req.body;

    Judge.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
console.log(user);

        if (user.password !== password) {
            return res.status(403).json({ msg: 'Password Mismatch !!' });
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


module.exports = {
    registerJudge,
    viewJudges,
    editJudgeById,
    viewActiveJudges,
    viewJudgeById,
    deleteJudgeById,
    forgotPassword,
    resetPassword,
    login,
   
    rejectJudgeById,
    activateJudgeById,
    deactivateJudgeById,
    viewJudgesBySpecializn,
    
};
