/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR LOGIN SCREEN (AdminLogin.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the secure authentication gateway for the system super-administrator.
 * It provides a login form where the administrator enters their username and password
 * to access the administrative control center.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered when navigating to the admin login route (e.g., `/admin-login`).
 * - When the administrator fills out the form and clicks "Submit":
 *     1. Validates that username and password are not blank.
 *     2. Compares the credentials to verify administrative privileges.
 *     3. On success: Saves `admin = 1` in `localStorage` and redirects the admin
 *        to `/admin-dashboard`.
 *     4. On failure: Displays an error message alert via toast notifications.
 * - If admin session state changes, it unlocks protected admin routes like
 *   viewing all users, advocates, court cases, feedbacks, and reports.
 * ==============================================================================
 */

import React, { useState } from "react";
import "../../../Styles/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img from "../../../Assets/adlogin.jpg";

/**
 * AdminLogin Component
 * --------------------
 * Renders the administrator sign-in form with visual side banner and input validation.
 */
function AdminLogin() {
    // Navigation hook to redirect the admin to the dashboard upon successful sign-in
    const navigate = useNavigate();

    // State storing form inputs (username/email and password)
    const [data, setData] = useState('');

    // State toggling password visibility (show/hide text)
    const [showPassword, setShowPassword] = useState(false);

    // State storing form validation error messages
    const [errors, setErrors] = useState({});

    // Optional check: Redirect if admin is already logged in
    // useEffect(() => {
    //     if (localStorage.getItem("admin") == 1)
    //         navigate('/admin-home');
    // }, []);

    /**
     * togglePasswordVisibility
     * ------------------------
     * Switches the password field between hidden dots and readable characters.
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    /**
     * handleChange
     * ------------
     * Captures user keystrokes in input boxes and updates the corresponding state property.
     * 
     * @param {Event} e - The input change event
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    /**
     * validate
     * --------
     * Validates that both the username (email) and password fields are filled.
     * Returns true if valid, or false if there are validation errors.
     */
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.email) {
            console.log("here");
            newErrors.email = 'Email is required';
        }

        if (!data.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * handleLogin
     * -----------
     * Handles form submission:
     * 1. Prevents browser page reload.
     * 2. Runs input validation.
     * 3. Checks credentials against admin credentials.
     * 4. Stores admin login flag in local storage and routes to the dashboard.
     * 
     * @param {Event} e - Form submission event
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(errors);

        console.log("api called", validate());

        // Stop if inputs are invalid or empty
        if (!validate()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        // Standard administrator credentials
        const hardCodedUsername = 'admin';
        const hardCodedPassword = 'admin@123';

        // Check if entered credentials match admin master account
        if (data.email === hardCodedUsername && data.password === hardCodedPassword) {
            // Save admin session flag in local storage (1 = logged in)
            localStorage.setItem("admin", 1);
            toast.success('Login successful!');
            // Redirect to Admin Dashboard
            navigate('/admin-dashboard');
        } else {
            // Display error notification if username or password does not match
            toast.error('Incorrect Username or Password');
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    {/* LEFT COLUMN: Decorative Admin Illustration Banner */}
                    <div className="col-6">
                        <div className="container justify-content-center">
                            <img src={img} className="img-fluid w-100" alt="user_reg_img" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Admin Sign-In Form */}
                    <div className="col-6">
                        <div className="user_registration_input_group admin-login-div1">
                            <h3 className="admin-login-h3">Admin Login</h3>
                            <form onSubmit={handleLogin}>
                                {/* Username Input Field */}
                                <div className="mt-5">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        className="form-control border border-dark"
                                        placeholder="Enter Username"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <span className="text-danger">{errors.email}</span>
                                    )}
                                </div>

                                {/* Password Input Field */}
                                <div className="mt-4">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control border border-dark"
                                        placeholder="Password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <span className="text-danger">{errors.password}</span>
                                    )}
                                </div>

                                {/* Submit & Reset Buttons */}
                                <div className="user_registration_button text-center mt-5 d-flex justify-content-evenly">
                                    <button type="submit">Submit</button>
                                    <button type="reset">Reset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;