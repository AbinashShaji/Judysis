import React, { useState } from "react";
import "../../Styles/AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img from "../../Assets/img22.jpeg";

function COLogin() {

    const navigate = useNavigate();
    const [data, setData] = useState('');

    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({});
    // useEffect(() => {
    //     if (localStorage.getItem("admin") == 1)
    //         navigate('/admin-home');
    // }, []);
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

        console.log("api called", validate());

        if (!validate()) {
            toast.error('Please fix the errors in the form.');
            return;
        }
        const hardCodedUsername = 'court';
        const hardCodedPassword = 'court@123';
        if (data.email === hardCodedUsername && data.password === hardCodedPassword) {
            localStorage.setItem("court", 1);
            toast.success('Login successful!');
            navigate('/co-dashboard');
        } else {
            toast.error('Incorrect Username or Password');
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
                                    <h3 className="co-login-h3">Court Office Login</h3>
                                    <form onSubmit={handleLogin}>
                                        <div className=" mt-5">
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
                                        <div className=" mt-4">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                className="form-control border border-dark"
                                                placeholder="Password"
                                                name="password"
                                            value={data.password}
                                            onChange={handleChange}
                                           
                                            />
                                            {errors.password&& (
                    <span className="text-danger">{errors.password}</span>
                  )}
                                        </div>

                                        <div className="user_registration_button text-center mt-5 d-flex justify-content-evenly">
                                            <button type="submit">Submit</button>
                                            <button type="reset">Reset</button>
                                        </div>


                                    </form>  </div>
                          
                        </div>

                    </div>


                </div>
         
        </div>
    );
}

export default COLogin;