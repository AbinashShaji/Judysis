import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/UserReg.css";
import img from '../../Assets/clientReg.png';
import { toast } from "react-toastify";
import 'remixicon/fonts/remixicon.css';

import { registerWithFile } from "../Services/CommonServices";

function UserRegistration() {
    const [data, setData] = useState('');

    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value,
        });
      };
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        const phoneRegex = /^\d{10}$/;
        const aadharRegex = /^\d{12}$/;
        if (!data.email) {
            console.log("here");

            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(data.email)) {
            newErrors.email = 'Invalid email format';
        }
    
        if (!data.password) {
          newErrors.password = 'Password is required';
        }
        else if (!passwordRegex.test(data.password)) {
            newErrors.password = 'Password Must Contain 1 Uppercase,1 Symbol and 1 Number with minimum 6 characters';
        }
        if (!data.aadhar) {
            newErrors.aadhar = 'Aadhar is required';
          }
          else if (!aadharRegex.test(data.aadhar)) {
            newErrors.aadhar = 'Invalid Aadhar Number';
        }
          if (!data.city) {
            newErrors.city = 'city is required';
          }
          if (!data.name) {
            newErrors.name = 'name is required';
          }
          if (!data.contact) {
            newErrors.contact = 'contact is required';
          }
          else if (!phoneRegex.test(data.contact)) {
            newErrors.contact = 'Invalid Contact Number';
        }
          if (!data.dob) {
            newErrors.dob = 'Date Of Birth is required';
          }
          if (!data.profilePic) {
            newErrors.profilePic = 'Profile Picture is required';
          }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(errors);
        
        console.log("api called",validate());
        
        if (!validate()) {
          toast.error('Please fix the errors in the form.');
          return;
        }
        try {
            console.log(data);
            
            const result = await registerWithFile(data, 'registerUser');

            if (result.success) {
                console.log(result);

                toast.success('Registration successful!');
                navigate('/user-login');


            } else {
                console.error('Registration error:', result);
                toast.info(result.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('An unexpected error occurred during Registration');
        }
       
    };
    const handleImageChange = (e) => {
        console.log("in file", e.target.files[0]);
        
        const file = e.target.files[0];
        setData({
          ...data,
          profilePic: file,
        });
      };
  

    return (
        <div className="user_registration">
        
            <div className="user_registration_container">
                <div className="user_registration_box1">
                    <div className="user_registration_input_group">
                        <form 
                        onSubmit={(e)=>{handleSubmit(e)}}
                        >
                            <div className="user_registration_input">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control border border-dark"
                                    placeholder="Enter your name"
                                    name="name"
                                  
                                    onChange={handleChange}
                                    
                                />
                                   {errors.name && (
                                    <span className="text-danger">{errors.name}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control border border-dark"
                                    placeholder="Enter your email"
                                    name="email"
                                  
                                    onChange={handleChange}
                                   
                                />
                                {errors.email && (
                                    <span className="text-danger">{errors.email}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Contact</label>
                                <input
                                    type="text"
                                    className="form-control border border-dark"
                                    placeholder="Enter your contact"
                                    name="contact"
                                    onChange={handleChange}

                                />
                                {errors.contact &&  (
                                    <span className="text-danger">{errors.contact}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>City</label>
                                <input
                                    type="text"
                                    className="form-control border border-dark"
                                    placeholder="Enter your address"
                                    name="city"
                               
                                    onChange={handleChange}
                                    
                                />
                                {errors.city &&  (
                                    <span className="text-danger">{errors.city}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>DOB</label>
                                <input
                                    type="date"
                                    className="form-control border border-dark"
                                    name="dob"
                                    max={new Date().toISOString().split("T")[0]}
                                    onChange={handleChange}
                                  
                                />
                                {errors.dob && (
                                    <span className="text-danger">{errors.dob}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Gender</label>
                                <select
                                    className="form-control border border-dark"
                                    name="gender"
                                    
                                    onChange={handleChange}
                                    
                                >
                                    <option value="" label="Select gender" />
                                    <option value="male" label="Male" />
                                    <option value="female" label="Female" />
                                    <option value="other" label="Other" />
                                </select>
                                {errors.gender  && (
                                    <span className="text-danger">{errors.gender}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Profile Picture</label>
                                <input
                                    type="file"
                                    className="form-control border border-dark"
                                    name="profilePic"
                                    onChange={handleImageChange}
                                />
                                {errors.profilePic  && (
                                    <span className="text-danger">{errors.profilePic}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Aadhar Number</label>
                                <input
                                    type="text"
                                    className="form-control border border-dark"
                                    placeholder="Enter your nationality"
                                    name="aadhar"
                                
                                    onChange={handleChange}
                                   
                                />
                                {errors.aadhar && (
                                    <span className="text-danger">{errors.aadhar}</span>
                                )}
                            </div>
                            <div className="user_registration_input mt-3">
                                <label>Password</label>
                                <div className="password-field">
                                    <input
                                        type="password"
                                        className="form-control border border-dark"
                                        placeholder="Password"
                                        name="password"
                                        
                                        onChange={handleChange}
                                     
                                    />
                                   
                                </div>
                                {errors.password  && (
                                    <span className="text-danger">{errors.password}</span>
                                )}
                            </div>
                            <div className="user_registration_button text-center mt-3">
                                <button type="submit">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="user_registration_box2">
                    <img src={img} className="img-fluid" alt="user_reg_img" />
                </div>
            </div>
        </div>
    );
}

export default UserRegistration;