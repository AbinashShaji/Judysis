/**
 * ============================================================================
 * CONTROLLER: advocateController.js
 * HANDOVER SUMMARY:
 * This controller manages accounts, authentication, legal profiles, and ratings
 * for Advocates (Lawyers). Lawyers are the legal defenders in JudiSys. They register
 * with official Bar Council credentials, receive consultation bookings from citizens,
 * accept cases, review court hearing schedules, and consult via integrated chat.
 * ============================================================================
 */

const Advocate = require('../models/advocateModel');
const multer = require("multer");
const user = require('../models/userModel');

/**
 * FILE UPLOAD STORAGE (Multer)
 * Lawyers must upload two crucial files during registration:
 * 1. 'profilePic' - Professional headshot photo.
 * 2. 'idProof' - Official Bar Council ID or law degree certificate.
 * Both files are stored with unique timestamp prefixes inside './upload'.
 */
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

// Middleware to capture both files during initial advocate registration.
const upload = multer({ storage: storage }).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]);

// Middleware for uploading only a new profile picture during profile editing.
const uploadProfile = multer({ storage: storage }).single('profilePic');

/**
 * FUNCTION: registerAdvocate
 * PURPOSE: Registers a new lawyer, saving their legal credentials and identity documents.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Register' button on AdvocateReg.js.
 * - Endpoint: POST /judisys_api/registerAdvocate
 * - Validation Checks:
 *   1. Is the Bar Council Enrollment Number already registered?
 *   2. Is the phone number already registered?
 *   3. Is the email address already registered?
 * - If this data changes: A new advocate record is created with 'adminApproved: false'.
 *   The lawyer appears in the Admin review queue (AdminViewAdvReqs.js).
 */
const registerAdvocate = async (req, res) => {
    try {
        const { fname, lname, bcNo, contact, email, password, experience, dob, specialization } = req.body;

        const profilePic = req.files.profilePic[0];
        const idProof = req.files.idProof[0];

        const newAdvocate = new Advocate({
            name: fname + " " + lname,
            bcNo,
            contact,
            email,
            password,
            experience,
            dob,
            specialization,
            idProof: idProof,
            profilePic: profilePic
        });

        // Step 1: Prevent duplicate Bar Council enrollment numbers.
        let existingAdvocate = await Advocate.findOne({ bcNo });
        if (existingAdvocate) {
            return res.json({
                status: 409,
                msg: "BarCouncil Enrollment Number Already Registered With Us !!",
                data: null
            });
        }

        // Step 2: Prevent duplicate phone numbers.
        let existingAdvocate2 = await Advocate.findOne({ contact });
        if (existingAdvocate2) {
            return res.json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }

        // Step 3: Prevent duplicate emails across both advocates and citizens.
        let existingAdvocate3 = await Advocate.findOne({ email });
        let existingAdvocate5 = await user.findOne({ email });
        if (existingAdvocate3 || existingAdvocate5) {
            return res.status(409).json({
                status: 409,
                msg: "Email Already Registered With Us !!",
                data: null
            });
        }

        // Step 4: Save new lawyer profile to MongoDB.
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

/**
 * FUNCTION: viewAdvocates
 * PURPOSE: Retrieves all approved lawyers (adminApproved: true).
 * 
 * ROUTING & RENDERING FLOW:
 * - Populates the lawyer directory in ViewAllAdvocates.js.
 */
const viewAdvocates = (req, res) => {
    Advocate.find({ adminApproved: true })
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
                    data: []
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

/**
 * FUNCTION: viewActiveAdvocates
 * PURPOSE: Retrieves only active, verified advocates ready to consult with citizens.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The citizen lawyer catalog on User_ViewAllAdvocates.js.
 */
const viewActiveAdvocates = (req, res) => {
    Advocate.find({ isActive: true })
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
                    data: []
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

/**
 * FUNCTION: viewAdvocatesBySpecializn
 * PURPOSE: Finds the top 5 highest-rated lawyers in a particular practice area (Civil, Criminal, etc.).
 * 
 * ROUTING & RENDERING FLOW:
 * - Powers category filtering on User_ViewAllAdvocates.js.
 */
const viewAdvocatesBySpecializn = (req, res) => {
    Advocate.find({ specialization: req.body.specialization })
        .sort({ rating: -1 })
        .limit(5)
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

/**
 * FUNCTION: viewAdvocateReqs
 * PURPOSE: Retrieves all advocates waiting for Admin approval (adminApproved: false).
 * 
 * ROUTING & RENDERING FLOW:
 * - Populates the pending requests table on AdminViewAdvReqs.js.
 */
const viewAdvocateReqs = (req, res) => {
    Advocate.find({ adminApproved: false })
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

/**
 * FUNCTION: approveAdvocateById
 * PURPOSE: Admin officially verifies a lawyer's credentials and activates their account.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Approve' button on AdminViewAdvReqs.js.
 * - Endpoint: POST /judisys_api/approveAdvocateById/:id
 * - If this data changes: The lawyer can now log in, take on cases, and receive appointments!
 */
const approveAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id }, { adminApproved: true, isActive: true })
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

/**
 * FUNCTION: activateAdvocateById
 * PURPOSE: Re-enables a suspended advocate account (isActive: true).
 */
const activateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id }, { isActive: true })
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

/**
 * FUNCTION: deactivateAdvocateById
 * PURPOSE: Freezes a lawyer's account access (isActive: false).
 */
const deactivateAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
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

/**
 * FUNCTION: rejectAdvocateById
 * PURPOSE: Rejects an advocate's registration by removing their record from MongoDB.
 */
const rejectAdvocateById = (req, res) => {
    Advocate.findByIdAndDelete({ _id: req.params.id })
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

/**
 * FUNCTION: editAdvocateById
 * PURPOSE: Updates an advocate's biography, contact number, or profile photo.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Save Profile' button on AdvocateEditProfile.js.
 */
const editAdvocateById = async (req, res) => {
    const { name, bcNo, contact, email, password, gender, address, experience, dob, professionalExperience, specialization } = req.body;

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
        profilePic: req.file
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

/**
 * FUNCTION: viewAdvocateById
 * PURPOSE: Fetches the detailed public and private profile of a single advocate.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: User_ViewAdvocateDetail.jsx and AdvocateEditProfile.js.
 */
const viewAdvocateById = (req, res) => {
    Advocate.findById({ _id: req.params.id })
        .exec()
        .then(data => {
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

/**
 * FUNCTION: deleteAdvocateById
 * PURPOSE: Marks an advocate account as 'inactive'.
 */
const deleteAdvocateById = (req, res) => {
    Advocate.findByIdAndUpdate({ _id: req.params.id }, { isActive: 'inactive' })
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

/**
 * FUNCTION: forgotPassword
 * PURPOSE: Resets a lawyer's password via their registered email address.
 */
const forgotPassword = async (req, res) => {
    const adv = await Advocate.findOne({ email: req.body.email });

    if (adv) {
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
    } else {
        res.status(405).json({
            status: 405,
            msg: "User Not Found"
        });
    }
};

/**
 * FUNCTION: resetPassword
 * PURPOSE: Verifies the old password before applying a new password for a lawyer.
 */
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

/**
 * FUNCTION: login
 * PURPOSE: Authenticates an Advocate using their email and password.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Sign In' button on AdvocateLogin.js.
 * - Endpoint: POST /judisys_api/loginAdvocate
 * - Checks:
 *   1. Account existence.
 *   2. Password match.
 *   3. Admin approval (If false: "Please wait for Admin Approval !!").
 *   4. Active account state (If false: "You are currently deactivated By Admin !!").
 * - If valid: Saves advocate ID to localStorage and redirects to AdvocateHome.js.
 */
const login = (req, res) => {
    const { email, password } = req.body;

    Advocate.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

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

/**
 * FUNCTION: addRating
 * PURPOSE: Calculates a rolling average star rating for a lawyer when a citizen leaves a review.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Submitting a star rating on User_ViewAdvocateDetail.jsx.
 * - Endpoint: POST /judisys_api/addRating/:id
 * - Formula: If previous rating exists, new rating = (oldRating + newRating) / 2.
 * - If this data changes: Updates the star rating displayed on the lawyer's profile card!
 */
const addRating = (req, res) => {
    let newRate = parseInt(req.body.rating);
    let rating = 0;

    Advocate.findById({ _id: req.params.id })
      .exec()
      .then((data) => {
        rating = data.rating;
        // Calculate rolling average
        if (data.rating != 0) rating = (rating + newRate) / 2;
        else rating = newRate;

        Advocate.findByIdAndUpdate(
          { _id: req.params.id },
          { rating: rating },
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
