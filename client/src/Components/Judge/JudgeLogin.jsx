/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeLogin.jsx
 * Path: client/src/Components/Judge/JudgeLogin.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the login gate for presiding courtroom Judges.
 * Judges type in their registered email and password to access the judicial portal.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/judge-login`
 * - Impact on the Application:
 *   1. Submits email and password to backend route `/loginjudge`.
 *   2. Upon successful authentication, saves the judge's database ID in
 *      `localStorage.setItem('judge', result.user._id)`.
 *   3. Redirects the judge to their personal judicial dashboard at `/judge-home`.
 *   4. Unlocks judge-only routes in `App.js` (reviewing case filings, adding hearings, issuing verdicts).
 * ==============================================================================
 */

import React, { useState } from "react";
import "../../Styles/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../../Styles/judge.css';
import img from "../../Assets/judge.avif";
import { login } from "../Services/CommonServices";

/**
 * JudgeLogin Component
 * Manages the credentials input, validation, and authentication session for judges.
 */
function JudgeLogin() {
  // Local state holding the judge's entered email and password
  const [data, setData] = useState({ email: '', password: '' });

  // State toggling password masking (show / hide password characters)
  const [showPassword, setShowPassword] = useState(false);
  // State storing validation error messages
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  /**
   * togglePasswordVisibility
   * Switches password between hidden dots and readable plain text.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * handleChange
   * Captures changes in the text boxes as the judge types.
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
   * Ensures the judge has entered both their email and password before contacting the server.
   * 
   * @returns {boolean} True if all fields are filled, false otherwise.
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
   * Submits the credentials to `/loginjudge` and initializes the judge session.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    // Verify fields are not blank
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      // Contact backend authentication service
      const result = await login(data, 'loginjudge');
      console.log(result);

      if (result.success) {
        // Save the authenticated judge ID into the browser's storage
        localStorage.setItem('judge', result.user._id);      
        
        // Take the judge directly to their cases overview dashboard
        navigate('/judge-home');
      } else {
        console.error('Login error:', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          {/* Left Column: Judicial Welcome Illustration */}
          <div className="col-6">
            <div className="container justify-content-center">
              <img src={img} className="img-fluid w-100 mt-5 login-img" alt="Judge Login Banner" />
            </div>
          </div>

          {/* Right Column: Sign-in Form */}
          <div className="col-6">
            <div className="user_registration_input_group admin-login-div1">
              <h3 className="advocate-login-h3">Judge Login</h3>
              <form onSubmit={handleLogin}>
                {/* Email Address Input */}
                <div className="mt-5">
                  <label>E-Mail</label>
                  <input
                    type="text"
                    className="form-control border border-dark"
                    placeholder="Enter e-mail here"
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
                    placeholder="Enter Password here"
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
                  <button type="submit">Login</button>
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

export default JudgeLogin;