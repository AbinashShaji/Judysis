/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: AdvocateEditProfile.js
 * Path: client/src/Components/Advocates/AdvocateEditProfile.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen allows practicing lawyers (advocates) to update their personal and
 * professional profile information. Lawyers can update their phone number, email,
 * password, years of courtroom experience, specialization, and upload a new profile photo.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/advocate-edit-profile`
 * - Security Guard: Checks `localStorage.getItem('advocate')`. If not logged in, kicks user to `/`.
 * - Data Journey:
 *   1. On page load, calls `/viewAdvocateById` using the lawyer's stored ID.
 *   2. Pre-fills all form input boxes with their existing database information.
 *   3. When the lawyer clicks "Update", validates input fields for completeness.
 *   4. Packs modified fields into a `FormData` object (handling file uploads).
 *   5. Sends the update to `/editAdvocateById/:id`.
 *   6. On success, redirects the lawyer back to their dashboard (`/advocate-home`).
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import '../../Styles/AdvocateEditProfile.css';
import img from '../../Assets/advocateBanner.png';
import tick from '../../Assets/editPofileCheckmark.png';
import { toast } from "react-toastify";

import { IMG_BASE_URL } from "../Services/BaseURL";

import { useNavigate } from 'react-router-dom';
import { editByIdwithFile, ViewById } from '../Services/CommonServices';

/**
 * AdvocateEditProfile Component
 * Renders the profile update form and handles multi-part data submission (text + image).
 */
function AdvocateEditProfile() {
  const navigate = useNavigate();

  /**
   * Security Check Effect:
   * Protects the page from unauthorized visitors. If no lawyer session token exists,
   * immediately sends the visitor back to the landing page.
   */
  useEffect(() => {
    if (localStorage.getItem('advocate') == null) {
      navigate('/');
    }
  }, [navigate]);
    
  // Retrieve the logged-in lawyer's unique database ID
  const id = localStorage.getItem('advocate');

  // Local state holding the lawyer's editable form information
  const [data, setData] = useState({
    name: '',
    dob: '',
    gender: '',
    nationality: '',
    city: '',
    contact: '',
    email: '',
    password: '',
    bcNo: '',
    dateOfEnrollment: '',
    bcState: '',
    specialization: '',
    experience: '',
    qualification: '',
    profilePic: {},
    idProof: null,
  });

  // Local state tracking validation error messages for each input box
  const [errors, setErrors] = useState({
    name: '',
    dob: '',
    gender: '',
    nationality: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    bcNo: '',
    dateOfEnrollment: '',
    bcState: '',
    specialization: '',
    experience: '',
    qualification: '',
    profilePic: '',
    idProof: '',
  });

  /**
   * fetchdata
   * Grabs the lawyer's existing details from the server and fills the form.
   */
  const fetchdata = async () => {
    try {
      console.log("id", id);
      const result = await ViewById('viewAdvocateById', id);

      if (result.success) {
        console.log(result);
        setData(result.user || []);
      } else {
        console.error('Advocate View Error :', result);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading profile');
    }
  };

  /**
   * Initial Load Effect:
   * Triggers `fetchdata()` when the component first mounts or when the ID changes.
   */
  useEffect(() => {
    console.log('in use');
    fetchdata();
  }, [id]);

  /**
   * handleChange
   * Updates state dynamically when the user types in a text box or selects a new photo file.
   * 
   * @param {Event} event - Input change event from browser
   */
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      // User selected a new image file from their device
      setData(prevData => ({
        ...prevData, 
        [name]: files[0] 
      }));
    } else {
      // User typed text into an input box
      setData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    // Clear any existing error message for this field as the user types
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  /**
   * validateField
   * Helper function ensuring required fields are not left empty.
   */
  function validateField(fieldName, value) {
    if (!value) {
      return `${fieldName} is required`;
    }
    return '';
  }

  /**
   * validateContact
   * Helper function ensuring phone numbers contain exactly 10 digits.
   */
  function validateContact(fieldName, value) {
    if (!value.toString().trim()) {
      return `${fieldName} is required`;
    } else if (value.length !== 10) {
      return 'Please enter a valid Contact Number';
    }
    return '';
  }

  /**
   * handleSubmit
   * Validates all inputs and sends updated details + photo to the backend server.
   * 
   * @param {Event} event - Form submission event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = {};
    let formIsValid = true;

    // Run validation checks on required fields
    errors.name = validateField('Full Name', data.name);
    errors.dob = validateField('Date of Birth', data.dob);
    errors.email = validateField('Email', data.email);
    errors.password = validateField('Password', data.password);
    errors.bcNo = validateField('Bar Council Enrollment Number', data.bcNo);
    errors.specialization = validateField('Specialization Areas', data.specialization);
    errors.experience = validateField('Years of Experience', data.experience);

    setErrors(errors);

    // If any error exists, mark form as invalid and halt submission
    for (let key in errors) {
      if (errors[key]) {
        formIsValid = false;
        break;
      }
    }

    if (formIsValid) {
      // Create FormData to package both text fields and binary file uploads together
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('dob', data.dob);
      formData.append('city', data.city);
      formData.append('contact', data.contact);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('bcNo', data.bcNo);
      formData.append('specialization', data.specialization);
      formData.append('experience', data.experience);
      formData.append('profilePic', data.profilePic);
        
      try {
        // Send multipart form data to the server
        const result = await editByIdwithFile('editAdvocateById', id, formData);

        if (result.success) {
          console.log(result);
          toast.success('Profile Updated successfully!');
          // Redirect the lawyer to their dashboard
          navigate('/advocate-home');
        } else {
          console.error('Update error:', result);
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred while saving profile');
      }
    }
  };

  return (
    <div>
      <div className='advocate_edit_profile'>
        <div className='container'>
          <div className='row '>
            {/* Left Side: Current Profile Photo and Informational Tips */}
            <div className=' col-5 mt-5'> 
              <div className='advocate_edit_profile_img d-flex justify-content-center'>
                <img 
                  src={`${IMG_BASE_URL}/${data.profilePic?.filename}`} 
                  className='img-fluid'
                  alt="Advocate Profile"
                />
              </div>
              <p className='advocate_edit_profile_title mt-5'>
                Stay Ahead <span className='text-gold'>: Keep Your Profile Updated!</span>
              </p>
              <p className='advocate_edit_profile_sub_title mt-4'>
                Regularly updating your information ensures you:
              </p>
              <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                <img src={tick} className='img-fluid' alt="Checkmark" />
                <p>Present your most recent experiences and specialization.</p>
              </div>
              <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                <img src={tick} className='img-fluid' alt="Checkmark" />
                <p>Reflect your ongoing professional development and education.</p>
              </div>
              <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                <img src={tick} className='img-fluid' alt="Checkmark" />
                <p>Provide potential clients with up-to-date contact information.</p>
              </div>
              <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                <img src={tick} className='img-fluid' alt="Checkmark" />
                <p>Ensure accuracy in your areas of expertise and practice.</p>
              </div>
            </div>

            {/* Right Side: The Edit Form */}
            <div className='col-7'>
              <div className='container-fluid bckcolor'>
                <div>
                  <div className='container'>
                    <form onSubmit={handleSubmit}>
                      {/* Name and Bar Council Number Fields */}
                      <div className="row mt-3">
                        <div className="col-sm-6 col-lg-6">
                          <label className="form-label advocateRegistrationlabel">Full Name :</label>
                          <input
                            type="text"
                            className="form-control textbox-style"
                            placeholder="Enter your Full Name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                          />
                          {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Bar Council Enrollment Number :</label>
                          <input
                            type="text"
                            className="form-control textbox-style"
                            placeholder="Enter your Bar Council enrollment number"
                            name="bcNo"
                            value={data.bcNo}
                            onChange={handleChange}
                          />
                          {errors.bcNo && <div className="text-danger">{errors.bcNo}</div>}
                        </div>
                      </div>

                      {/* Date of Birth and Phone Number Fields */}
                      <div className="row mt-2">
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Date of Birth :</label>
                          <input
                            type="date"
                            className="form-control textbox-style"
                            name="dob"
                            value={data.dob ? data.dob.slice(0, 10) : ''}
                            onChange={handleChange}
                          />
                          {errors.dob && <div className="text-danger">{errors.dob}</div>}
                        </div>
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Contact Number :</label>
                          <input
                            type="text"
                            className="form-control textbox-style"
                            placeholder="Enter your contact number"
                            name="contact"
                            value={data.contact}
                            onChange={handleChange}
                          />
                          {errors.contact && <div className="text-danger">{errors.contact}</div>}
                        </div>
                      </div>

                      {/* Email and Experience Fields */}
                      <div className="row mt-2">
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Email :</label>
                          <input
                            type="email"
                            className="form-control textbox-style"
                            placeholder="Enter your email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                          />
                          {errors.email && <div className="text-danger">{errors.email}</div>}     
                        </div>
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Years of Experience :</label>
                          <input
                            type="text"
                            className="form-control textbox-style"
                            placeholder="Enter your years of experience"
                            name="experience"
                            value={data.experience}
                            onChange={handleChange}
                          />
                          {errors.experience && <div className="text-danger">{errors.experience}</div>}
                        </div>
                      </div>

                      {/* Password and Profile Photo Upload */}
                      <div className="row mt-2">
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Password :</label>
                          <input
                            type="password"
                            className="form-control textbox-style"
                            placeholder="Enter your password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                          />
                          {errors.password && <div className="text-danger">{errors.password}</div>}
                        </div>
                        <div className="col-6">
                          <label className="form-label advocateRegistrationlabel">Profile Photo :</label>
                          <input
                            type="file"
                            className="form-control textbox-style"
                            name="profilePic"
                            onChange={handleChange}
                          />
                          {errors.profilePic && <div className="text-danger">{errors.profilePic}</div>}
                        </div>
                      </div>

                      {/* Submit / Update Button */}
                      <div className="row mt-3">
                        <div className="col-12">
                          <button type="submit" className="btn btn-warning">Update</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvocateEditProfile;

