/**
 * ============================================================================
 * CONTROLLER: userController.js
 * HANDOVER SUMMARY:
 * This controller manages accounts, authentication, and profile settings for Citizens (Litigants).
 * Citizens are the regular people who use JudiSys to seek legal justice. They register,
 * upload identity documents, browse specialized lawyers, book appointments, and file cases.
 * The administrator uses this controller to review and approve citizens before they can log in.
 * ============================================================================
 */

const User = require('../models/userModel'); 
const multer = require("multer");

/**
 * FILE UPLOAD STORAGE (Multer)
 * Handles uploading the citizen's profile picture or verification document.
 * Files are given a unique timestamp prefix and saved into the './upload' folder.
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

// Multer middleware for a single profile photo file.
const uploadSingle = multer({ storage: storage }).single('profilePic');

/**
 * FUNCTION: registerUser
 * PURPOSE: Onboards a new citizen with their contact info, Aadhar number, and profile photo.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Register' button on UserRegistration.js.
 * - Endpoint: POST /judisys_api/registerUser
 * - Validation:
 *   1. Checks if the Phone Contact is already registered.
 *   2. Checks if the Email Address is already registered.
 *   3. Checks if the Government Aadhar ID is already registered.
 * - If this data changes: A new citizen record is created with 'adminApproved: false'.
 *   The user appears in the Admin pending verification queue (AdminViewUserReqs.js).
 */
const registerUser = async (req, res) => {
    try {
        const { email, contact, password, aadhar, city, dob, gender, name } = req.body;

        const newUser = new User({
            email,
            contact,
            password,
            aadhar,
            city,
            dob,
            gender,
            profilePic: req.file, 
            name
        });

        // Step 1: Check for duplicate contact number.
        let existingUser = await User.findOne({ contact });
        if (existingUser) {
            return res.status(409).json({
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }

        // Step 2: Check for duplicate email.
        existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                msg: "Email Already Registered With Us !!",
                data: null
            });
        }
        
        // Step 3: Check for duplicate Aadhar card number.
        existingUser = await User.findOne({ aadhar });
        if (existingUser) {
            return res.status(409).json({
                msg: "Aadhar Number Already Registered With Us !!",
                data: null
            });
        }

        // Step 4: Save new citizen profile in MongoDB.
        await newUser.save();
        return res.status(200).json({
            msg: "Inserted successfully",
            data: newUser,
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * FUNCTION: requestAdvocate
 * PURPOSE: Flags that a citizen is actively seeking an advocate for legal representation.
 */
const requestAdvocate = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.advocateRequested) {
      return res
        .status(400)
        .json({ msg: "You have already requested an advocate." });
    }

    user.advocateRequested = true;
    await user.save();

    res.json({ msg: "Advocate request submitted successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

/**
 * FUNCTION: viewUsersForAdminAprvl
 * PURPOSE: Retrieves all citizens whose accounts are awaiting Admin review (adminApproved: false).
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load in AdminViewUserReqs.js.
 * - Endpoint: POST /judisys_api/viewUsersForAdmin
 * - Populates the verification table where the admin can click 'Approve' or 'Reject'.
 */
const viewUsersForAdminAprvl = (req, res) => {
    User.find({ adminApproved: false })
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
 * FUNCTION: editUserById
 * PURPOSE: Updates a citizen's profile details and optionally replaces their photo.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Save Profile' button on UserProfile.js.
 * - Endpoint: POST /judisys_api/editUserById/:id
 */
const editUserById = async (req, res) => {
    const { email, contact, city, gender, dob, name } = req.body;
    const userId = req.params.id;

    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                msg: "User not found",
                data: null
            });
        }

        // Check if new phone number conflicts with another existing user
        const duplicateContact = await User.findOne({ contact });
        if (duplicateContact && duplicateContact._id.toString() !== userId) {
            return res.status(409).json({
                status: 409,
                msg: "Contact Number Already Registered With Us !!",
                data: null
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            email,
            contact,
            city,
            gender,
            dob,
            name,
            profilePic: req.file,
        }, { new: true });

        return res.json({
            status: 200,
            msg: "Updated successfully",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            msg: "Data not Updated",
            Error: err
        });
    }
};

/**
 * FUNCTION: viewUserById
 * PURPOSE: Fetches the complete account profile for a specific citizen.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: UserProfile.js to display the citizen's personal information.
 * - Endpoint: POST /judisys_api/viewUserById/:id
 */
const viewUserById = (req, res) => {
    User.findById(req.params.id)
        .exec()
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    status: 404,
                    msg: "User not found",
                });
            }
            res.json({
                status: 200,
                msg: "Data obtained successfully",
                data: data
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                msg: "Error fetching data",
                Error: err
            });
        });
};

/**
 * FUNCTION: viewAllUsers
 * PURPOSE: Retrieves all verified citizens (adminApproved: true) for directory management.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: AdminViewUsers.js and COViewUsers.js.
 * - Endpoint: POST /judisys_api/viewAllUsers
 */
const viewAllUsers = (req, res) => {
    User.find({ adminApproved: true })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data obtained successfully",
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
 * FUNCTION: login
 * PURPOSE: Validates a citizen's email and password to log them into the Citizen Portal.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Sign In' button on UserLogin.js.
 * - Endpoint: POST /judisys_api/loginUser
 * - Checks:
 *   1. Does this user exist?
 *   2. Does the password match?
 *   3. Has the Admin approved this account? (If false: "Please wait for Admin Approval !!")
 *   4. Is this account currently active? (If false: "You are currently deactivated By Admin !!")
 * - If valid: Saves user data to localStorage and redirects to UserHome.js.
 */
const login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).then(user => {
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
 * FUNCTION: deleteUserById
 * PURPOSE: Permanently removes a citizen account from MongoDB.
 */
const deleteUserById = (req, res) => {
    User.findByIdAndDelete({ _id: req.params.id })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data updated successfully",
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
 * FUNCTION: approveUserById
 * PURPOSE: Admin officially approves a citizen's account, enabling both 'isActive' and 'adminApproved'.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The green 'Approve' checkmark on AdminViewUserReqs.js.
 * - Endpoint: POST /judisys_api/approveUserById/:id
 * - If this data changes: The citizen is immediately permitted to log in and file cases.
 */
const approveUserById = (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { isActive: true, adminApproved: true })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data updated successfully",
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
 * FUNCTION: activateUserById
 * PURPOSE: Re-enables a citizen's login access (isActive: true).
 */
const activateUserById = (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { isActive: true })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data updated successfully",
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
 * FUNCTION: deActivateUserById
 * PURPOSE: Freezes a citizen's login access (isActive: false).
 */
const deActivateUserById = (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { isActive: false })
        .exec()
        .then(data => {
            res.json({
                status: 200,
                msg: "Data updated successfully",
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
 * FUNCTION: rejectUserById
 * PURPOSE: Rejects a citizen's registration application by removing the record.
 */
const rejectUserById = (req, res) => {
    User.findByIdAndDelete({ _id: req.params.id })
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
 * PURPOSE: Updates password based on the citizen's registered email address.
 */
const forgotPassword = (req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, {
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
};

/**
 * FUNCTION: resetPassword
 * PURPOSE: Verifies the citizen's old password before allowing them to set a new password.
 */
const resetPassword = async (req, res) => {
    let pwdMatch = false;

    await User.findById({ _id: req.params.id })
        .exec()
        .then(data => {
            if (data.password === req.body.oldpassword)
                pwdMatch = true;
        })
        .catch(err => {
            return res.status(500).json({
                status: 500,
                msg: "Data not Updated",
                Error: err
            });
        });

    if (pwdMatch) {
        await User.findByIdAndUpdate({ _id: req.params.id }, {
            password: req.body.password
        })
            .exec()
            .then(data => {
                if (data != null)
                    return res.json({
                        status: 200,
                        msg: "Updated successfully"
                    });
                else
                    return res.json({
                        status: 500,
                        msg: "User Not Found"
                    });
            })
            .catch(err => {
                return res.status(500).json({
                    status: 500,
                    msg: "Data not Updated",
                    Error: err
                });
            });
    } else {
        return res.json({
            status: 405,
            msg: "Your Old Password doesn't match"
        });
    }
};

module.exports = {
    registerUser,
    uploadSingle,
    viewUserById,
    login,
    viewUsersForAdminAprvl,
    editUserById,
    deleteUserById,
    viewAllUsers,
    resetPassword,
    forgotPassword,
    activateUserById,
    approveUserById,
    deActivateUserById,
    rejectUserById,
    requestAdvocate,
};
