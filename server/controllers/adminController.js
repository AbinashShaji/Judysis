/**
 * ============================================================================
 * CONTROLLER: adminController.js
 * HANDOVER SUMMARY:
 * This file handles authentication and password security for the central System 
 * Administrator. The administrator has master control over the entire JudiSys platform, 
 * including approving registered lawyers, vetting citizens, and monitoring active court cases.
 * ============================================================================
 */

const Admin = require('../models/adminModel');

/**
 * FUNCTION: adminResetPassword
 * PURPOSE: Allows the system administrator to change their master login password.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Admin settings or password change screen.
 * - Endpoint: POST /judisys_api/adminResetPassword
 * - If this data changes: The admin must use their newly created password on the
 *   very next login attempt at the Admin Login screen (AdminLogin.js).
 */
const adminResetPassword = async (req, res) => {
    // Step 1: Look in MongoDB to see if an admin account already exists.
    const Admin1 = await Admin.findOne({ email: 'admin@gmail.com' });

    // Step 2: If no admin account exists yet, create the default admin account.
    if (!Admin1) {
        const admin = new Admin({
            email: 'admin@gmail.com',
            password: req.body.password
        });

        // Step 3: Save the new admin credentials to the database.
        await admin.save()
            .then(data => {
                return res.json({
                    status: 200,
                    msg: "password changed successfully",
                    data: data
                });
            })
            .catch(err => {
                console.log(err);
                return res.json({
                    status: 500,
                    msg: "Data not Inserted",
                    data: err
                });
            });
    } else {
        // Step 4: If the admin already exists, simply update the password field.
        Admin.updateOne({
            email: 'admin@gmail.com',
            password: req.body.password
        }).exec().then(data => {
            return res.json({
                status: 200,
                msg: "password changed successfully",
                data: data
            });
        }).catch(err => {
            return res.json({
                status: 500,
                msg: "Data not Inserted",
                data: err
            });
        });
    }
};

/**
 * FUNCTION: login
 * PURPOSE: Validates the administrator's email and password to grant access to the Admin Dashboard.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Sign In' button on the Admin Login page (AdminLogin.js).
 * - Endpoint: POST /judisys_api/adminLogin
 * - If this data is valid (Status 200): The browser stores session info in localStorage
 *   and redirects the admin directly to the main administration portal (AdminMain.js).
 * - If invalid: Shows an alert ("Password Mismatch" or "Invalid Username") on the login page.
 */
const login = (req, res) => {
    const { email, password } = req.body;

    // Step 1: Search MongoDB for an administrator with the submitted email.
    Admin.findOne({ email }).then(user => {
        // Step 2: If no database record is found, check if they are using default hardcoded backup credentials.
        if (!user) {
            if (email == "admin@gmail.com") {
                if (password == "admin@123") {
                    // Default fallback login success
                    res.json({
                        status: 200,
                        msg: "Login Succesful"
                    });
                } else {
                    return res.json({ status: 405, msg: 'Password Mismatch !!' });
                }
            } else {
                return res.json({ status: 405, msg: 'Invalid Username' });
            }
        } 
        // Step 3: If an admin record was found in the database, compare the saved password.
        else if (user.password != password) {
            return res.json({ status: 405, msg: 'Password Mismatch !!' });
        } else {
            // Step 4: Passwords match! Send back the admin profile and status 200.
            res.json({
                status: 200,
                data: user,
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json({ status: 500, msg: 'Something went wrong' });
    });
};

module.exports = {
    adminResetPassword,
    login
};