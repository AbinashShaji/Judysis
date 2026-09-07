/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COAddJudge.js
 * Path: client/src/Components/CourtOffice/Dashboard/COAddJudge.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen provides an official registration form for Court Office staff to onboard
 * and appoint new courtroom Judges into the judicial system.
 * Staff enter the Judge's full name, contact information, legal specialization
 * (e.g. Criminal Law, Corporate Law), years of experience on the bench, and password.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-add-judge` inside the `COMain` shell container.
 * - Rendering Impact: Accessible from the Judges section of the Court Office Dashboard.
 * - Data Journey:
 *   1. Captures form inputs (name, email, phone, DOB, experience, specialization, password).
 *   2. Validates password complexity, phone digit length, and email format.
 *   3. Posts data to backend route `/registerJudge`.
 *   4. On success: redirects the clerk to the judge directory at `/co-view-judges`.
 * ==============================================================================
 */

import React, { useState } from 'react';
import '../../../Styles/AdvocateReg.css';
import img1 from "../../../Assets/adv4.avif";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { register, registerWithFile } from '../../Services/CommonServices';

/**
 * COAddJudge Component
 * Handles the registration and credential provisioning for new judges.
 */
function COAddJudge() {
  const navigate = useNavigate();

  // State storing the judge's new profile details
  const [data, setData] = useState({
    fname: '',
    lname: '',
    contact: '',
    email: '',
    district: '',
    password: '',
    regno: '',
    gender: '',
    cpassword: '',
    specialization: '',
    experience: '',
    dob: '',
  });

  // State storing form validation errors
  const [errors, setErrors] = useState({
    fname: '',
    lname: '',
    contact: '',
    email: '',
    city: '',
    state: '',
    district: '',
    password: '',
    cpassword: '',
    specialization: '',
  });

  /**
   * handleChange
   * Captures changes as the court clerk types in the form inputs.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  /**
   * validateField
   * Verifies required fields are not empty.
   */
  const validateField = (fieldName, value) => {
    if (!value) {
      return `${fieldName} is required`;
    }
    return '';
  };

  /**
   * validateField2
   * Verifies phone number format (must be 10 digits).
   */
  const validateField2 = (fieldName, value) => {
    const phoneRegex = /^\d{10}$/;
    if (fieldName === 'contact') {
      if (!phoneRegex.test(data.contact)) {
        return 'Invalid Contact Number';
      }
    }
    return '';
  };

  /**
   * validateField3
   * Validates email format and ensures password complexity.
   */
  const validateField3 = (fieldName, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (fieldName === 'password' && !passwordRegex.test(data.password)) {
      return 'Password Must Contain 1 Uppercase, 1 Symbol and 1 Number with minimum 6 characters';
    }
  
    if (fieldName === 'email' && (!emailRegex.test(data.email))) {
      return 'Invalid email format';
    }
    return '';
  };

  /**
   * validateContact
   * Checks phone number completeness on blur.
   */
  const validateContact = (fieldName, value) => {
    if (!value) {
      return `${fieldName} is required`;
    } else if (value.length !== 10) {
      return `Please enter a valid Contact Number `;
    }
    return '';
  };

  /**
   * handleImageChange
   * Helper handler for profile image selection if needed.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData({
      ...data,
      profilePic: file,
    });
  };

  /**
   * handleImageChange2
   * Helper handler for official ID proof attachment if needed.
   */
  const handleImageChange2 = (e) => {
    const file = e.target.files[0];
    setData({
      ...data,
      idProof: file,
    });
  };

  /**
   * handleSubmit
   * Validates form and submits new judge credentials to `/registerJudge`.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = {};

    // Validate required fields
    errors.email = validateField('Email', data.email);
    errors.password = validateField('Password', data.password);
    errors.fname = validateField('First Name', data.fname);
    errors.contact = validateContact('Contact', data.contact);
    errors.experience = validateField('Experience', data.experience);
    errors.specialization = validateField('Specialization', data.specialization);
    errors.dob = validateField('Date Of Birth', data.dob);

    // Validate regex rules for phone, email, and password complexity
    errors.contact = validateField2('contact', data.contact);
    errors.email = validateField3('email', data.email);
    errors.password = validateField3('password', data.password);

    setErrors(errors);

    // Confirm that every error property is empty
    const formIsValid = Object.values(errors).every((error) => error === ''); 

    if (!formIsValid) {
      console.log("Validation failed", errors);
      return; // Stop submission if there are validation errors
    }

    try {
      // Send judge registration payload to backend
      const result = await register(data, 'registerJudge');

      if (result.success) {
        console.log(result);
        toast.success('Judge registered successfully!');
        // Redirect clerk to the Judge directory
        navigate('/co-view-judges');
      } else {
        console.error('Registration error:', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during Registration');
    }
  };

  return (
    <div>
      <div>
        <h2 className="advocateRegistrationtitle">Add New Judge</h2>

        <div className='row container-fluid'>
          <div className='col-12 container-fluid mt-3'>
            <form onSubmit={handleSubmit}>
              {/* Row 1: First Name & Last Name */}
              <div className="row mt-5">
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="First Name Here"
                    value={data.fname}
                    onChange={handleChange}
                    name="fname"
                  />
                  {errors.fname && <div className="text-danger">{errors.fname}</div>}
                </div>

                <div className="col-6">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Last Name Here"
                    name="lname"
                    value={data.lname}
                    onChange={handleChange}
                  />
                  {errors.lname && <div className="text-danger">{errors.lname}</div>}
                </div>
              </div>

              {/* Row 2: Email & Legal Specialization Dropdown */}
              <div className='row mt-3'>
                <div className="col-6">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                <div className="col-6">
                  <select
                    className="form-control p-2"
                    name="specialization"
                    onChange={handleChange}
                    value={data.specialization}
                  >
                    <option value="">Select Specialization</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Civil Litigation">Civil Litigation</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Intellectual Property Law">Intellectual Property Law</option>
                    <option value="Taxation Law">Taxation Law</option>
                    <option value="Constitutional Law">Constitutional Law</option>
                    <option value="Real Estate Law">Real Estate Law</option>
                    <option value="Labor and Employment Law">Labor and Employment Law</option>
                    <option value="Environmental Law">Environmental Law</option>
                    <option value="Cyber Law">Cyber Law</option>
                    <option value="Immigration Law">Immigration Law</option>
                  </select>
                  {errors.specialization && <div className="text-danger">{errors.specialization}</div>}
                </div>
              </div>

              {/* Row 3: Phone Number & Date of Birth */}
              <div className="row mt-3">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Contact Number"
                    name="contact"
                    value={data.contact}
                    onChange={handleChange}
                    onBlur={() => setErrors(prevErrors => ({
                      ...prevErrors,
                      contact: validateContact('Contact', data.contact)
                    }))}
                  />
                  {errors.contact && <div className="text-danger">{errors.contact}</div>}
                </div>

                <div className="col-6">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="dob"
                    value={data.dob}
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    onChange={handleChange}
                  />
                  {errors.dob && <div className="text-danger">{errors.dob}</div>}
                </div>
              </div>

              {/* Row 4: Years of Experience & Initial Password */}
              <div className="row mt-3">
                <div className='col-6'>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Experience (Years)"
                    name="experience"
                    value={data.experience}
                    onChange={handleChange}
                  />
                  {errors.experience && <div className="text-danger">{errors.experience}</div>}
                </div>

                <div className="col-6">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                  /> 
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>
              </div>

              {/* Submit Registration Button */}
              <div className="row mt-3">
                <center> 
                  <button type="submit" className="btn btn-secondary w-50 advocateRegistrationbutton mt-3">
                    Register
                  </button> 
                </center>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default COAddJudge;