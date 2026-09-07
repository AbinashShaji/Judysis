/**
 * ============================================================================
 * CONTROLLER: judgeController.js
 * HANDOVER SUMMARY:
 * This controller manages accounts, authentication, and directory queries for Judges.
 * Judges preside over active courtroom trials, review evidence dossiers, and issue
 * legal orders and hearing dates. The Court Office uses this controller to register 
 * judges and assign them to eligible cases.
 * ============================================================================
 */

const Judge = require('../models/judgeModel');
const user = require('../models/userModel');
const advocate = require('../models/advocateModel');

/**
 * FUNCTION: registerJudge
 * PURPOSE: Onboards a new Judge into the judicial directory.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Add Judge' form in Court Office (COAddJudge.js).
 * - Endpoint: POST /judisys_api/registerJudge
 * - Verification: Checks across Judge, User, and Advocate collections to ensure
 *   neither the phone number nor email address is already registered in the system.
 * - If this data changes: The judge appears in AdminViewJudjes.js and COViewAlljudges.jsx.
 */
const registerJudge = async (req, res) => {
    try {
        const { fname, lname, contact, email, password, experience, dob, specialization } = req.body;

        const newJudge = new Judge({
            name: fname + " " + lname,
            contact,
            email,
            password,
            experience,
            dob,
            specialization,
        });

        // Step 1: Prevent duplicate phone numbers or emails across all roles.
        let existingJudge3 = await Judge.findOne({ email });
        let existingJudge5 = await user.findOne({ email });
        let existingJudge2 = await Judge.findOne({ contact });
        let existingJudge4 = await user.findOne({ email });
        let existingJudge6 = await advocate.findOne({ email });

        if (existingJudge2) {
            return res.json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        } else if (existingJudge3 || existingJudge5 || existingJudge4 || existingJudge6) {
            return res.status(409).json({
                status: 409,
                msg: "Email Already Registered With Us !!",
                data: null
            });
        }

        // Step 2: Save the new Judge profile in MongoDB.
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

/**
 * FUNCTION: viewJudges
 * PURPOSE: Retrieves the full list of all registered judges.
 * 
 * ROUTING & RENDERING FLOW:
 * - Populates the judge directory tables in AdminViewJudjes.js and COViewAlljudges.jsx.
 */
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
 * FUNCTION: viewActiveJudges
 * PURPOSE: Retrieves only judges who are currently active and available to preside over cases.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Court Office when selecting a judge to assign to a case (COViewSinglecase.jsx).
 */
const viewActiveJudges = (req, res) => {
    Judge.find({ isActive: true })
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
 * FUNCTION: viewJudgesBySpecializn
 * PURPOSE: Filters judges matching a specific legal specialization (e.g. Criminal, Civil).
 */
const viewJudgesBySpecializn = (req, res) => {
    Judge.find({ specialization: req.body.specialization })
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
 * FUNCTION: activateJudgeById
 * PURPOSE: Sets a judge's status to active (isActive: true).
 */
const activateJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({ _id: req.params.id }, { isActive: true })
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
 * FUNCTION: deactivateJudgeById
 * PURPOSE: Temporarily pauses a judge's authorization to preside over cases (isActive: false).
 */
const deactivateJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
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
 * FUNCTION: rejectJudgeById
 * PURPOSE: Removes a judge from the system registry.
 */
const rejectJudgeById = (req, res) => {
    Judge.findByIdAndDelete({ _id: req.params.id })
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
 * FUNCTION: editJudgeById
 * PURPOSE: Updates a judge's contact details, experience, or court specialization.
 */
const editJudgeById = async (req, res) => {
    const { name, contact, email, password, gender, experience, dob, specialization } = req.body;

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

/**
 * FUNCTION: viewJudgeById
 * PURPOSE: Retrieves detailed profile information for a single judge.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: COViewSIngleJudge.jsx.
 */
const viewJudgeById = (req, res) => {
    Judge.findById({ _id: req.params.id })
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
 * FUNCTION: deleteJudgeById
 * PURPOSE: Marks a judge account as 'inactive'.
 */
const deleteJudgeById = (req, res) => {
    Judge.findByIdAndUpdate({ _id: req.params.id }, { isActive: 'inactive' })
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
 * PURPOSE: Allows a judge to reset their password using their registered email.
 */
const forgotPassword = async (req, res) => {
    const adv = await Judge.findOne({ email: req.body.email });

    if (adv) {
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
    } else {
        res.status(405).json({
            status: 405,
            msg: "User Not Found"
        });
    }
};

/**
 * FUNCTION: resetPassword
 * PURPOSE: Changes a judge's password after verifying their old password matches.
 */
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

/**
 * FUNCTION: login
 * PURPOSE: Authenticates a Judge using their email and password.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Sign In' button on JudgeLogin.jsx.
 * - Endpoint: POST /judisys_api/loginjudge
 * - Checks:
 *   1. Does the account exist?
 *   2. Does the password match?
 *   3. Is the account active? (If inactive, returns: "You are currently deactivated By Admin !!")
 * - If valid: Saves judge ID to localStorage and redirects to JudgeHome.jsx.
 */
const login = (req, res) => {
    const { email, password } = req.body;

    Judge.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

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
