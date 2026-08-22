import React, { useState } from "react";
import "../../Styles/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img from "../../Assets/image23.png";
import { login } from "../Services/CommonServices";

function AdvocateLogin() {
 
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
        
          const handleLogin = async (e) => {
            e.preventDefault()
            console.log(errors);
            
            console.log("api called",validate());
            
            if (!validate()) {
              toast.error('Please fix the errors in the form.');
              return;
            }
        
            try {
              const result = await login(data,'loginAdvocate');
              console.log(result);
              if (result.success) {
                
                localStorage.setItem('advocate', result.user._id)      
                     
                navigate('/advocate-home');
    
               
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
                            <div className="col-6">
                                <div className="container justify-content-center">
                                    <img src={img} className="img-fluid w-100 mt-5" alt="user_reg_img" />
                                </div>
                                </div>
                            <div className="col-6">
                                    <div className="user_registration_input_group admin-login-div1">
                                        <h3 className="advocate-login-h3">Advocate Login</h3>
                                        <form onSubmit={handleLogin}>
                                            <div className=" mt-5">
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
                                            <div className=" mt-4">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control border border-dark"
                                                    placeholder="Enter Password here"
                                                    name="password"
                                                value={data.password}
                                                onChange={handleChange}
                                               
                                                />
                                                {errors.password&& (
                        <span className="text-danger">{errors.password}</span>
                      )}
                                            </div>
    
                                            <div className="user_registration_button  text-center mt-5 d-flex justify-content-evenly">
                                                <button type="submit">Login</button>
                                                <button type="reset">Reset</button>
                                            </div>
                                            <div className="mt-2 mb-5 container  ">
                      Don't Have An Account ?  <Link className="vo-login-forgotpswd user-login-link"
                      //  to="user-regd:\ChristNagar 24\Legal_Liaison\client\src\Components\User\UserProfile.js"
                      to="/att-signup"
                       >Sign Up </Link>
                      </div>
    
                                        </form>  </div>
                              
                            </div>
                           
                        </div>
                       
    
                    </div>
             
            </div>
        );
    }
    

export default AdvocateLogin