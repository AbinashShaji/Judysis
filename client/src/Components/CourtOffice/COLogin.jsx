/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COLogin.jsx
 * Path: client/src/Components/CourtOffice/COLogin.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the sign-in portal for Court Office Staff (Registry Clerks).
 * Court office staff are responsible for reviewing filed cases, appointing
 * judges to benches, and verifying citizen case submissions.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/court-office-login`
 * - Authentication Flow:
 *   - Verifies username against `'court'` and password against `'court@123'`.
 *   - On successful entry: Saves session flag `localStorage.setItem("court", 1)`.
 *   - Redirects to `/co-dashboard`.
 *   - Unlocks the Court Office operations suite in `App.js` (`COMain`, judge assignment, case verification).
 * ==============================================================================
 */

import React, { useState } from "react";
import "../../Styles/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img from "../../Assets/img22.jpeg";

/**
 * COLogin Component
 * Provides credential inputs and validation for court registry staff.
 */
function COLogin() {
  const navigate = useNavigate();

  // State storing the entered username and password
  const [data, setData] = useState({ email: '', password: '' });

  // State controlling password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  // State storing validation error messages
  const [errors, setErrors] = useState({});

  /**
   * togglePasswordVisibility
   * Toggles whether the password is masked or visible as plain text.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * handleChange
   * Updates state as the court staff types their credentials.
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
   * Ensures username and password fields are filled before checking credentials.
   */
  const validate = () => {
    const newErrors = {};

    if (!data.email) {
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
   * Verifies office credentials and initializes court staff session in localStorage.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    // Default administrative credentials for Court Office personnel
    const hardCodedUsername = 'court';
    const hardCodedPassword = 'court@123';

    if (data.email === hardCodedUsername && data.password === hardCodedPassword) {
      // Set session authorization key
      localStorage.setItem("court", 1);
      toast.success('Login successful!');
      // Navigate to the master court office operations dashboard
      navigate('/co-dashboard');
    } else {
      toast.error('Incorrect Username or Password');
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          {/* Left Column: Court Office Illustration */}
          <div className="col-6">
            <div className="container justify-content-center">
              <img src={img} className="img-fluid w-100 mt-5" alt="Court Office Login Banner" />
            </div>
          </div>

          {/* Right Column: Sign-in Form */}
          <div className="col-6">
            <div className="user_registration_input_group admin-login-div1">
              <h3 className="co-login-h3">Court Office Login</h3>
              <form onSubmit={handleLogin}>
                {/* Username Input */}
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

                {/* Password Input */}
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

                {/* Form Buttons */}
                <div className="user_registration_button text-center mt-5 d-flex justify-content-evenly">
                  <button type="submit">Submit</button>
                  <button type="reset" onClick={() => setData({ email: '', password: '' })}>Reset</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default COLogin;