import React, { useState } from 'react'
import '../../../Styles/AdvocateReg.css'
import img1 from "../../../Assets/adv4.avif"
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { register, registerWithFile } from '../../Services/CommonServices';
function COAddJudge() {


    const navigate = useNavigate()
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

    });
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
    const validateField = (fieldName, value) => {
        if (!value) {
            return `${fieldName} is required`;
        }
        return '';
    }
    const validateField2 = (fieldName, value) => {
        const phoneRegex = /^\d{10}$/;
        if (fieldName == 'contact') {

            if (!phoneRegex.test(data.contact)) {
                return 'Invalid Contact Number';
            }
        }
        return ''
    }
    const validateField3 = (fieldName, value) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (fieldName == 'password' && !passwordRegex.test(data.password)) {
            return 'Password Must Contain 1 Uppercase,1 Symbol and 1 Number with minimum 6 characters';
        }
      
        if (fieldName == 'email' && (!emailRegex.test(data.email))) {
            return 'Invalid email format';
        }
        return '';
    }
    const validateContact = (fieldName, value) => {
        if (!value) {
            console.log("val", value);
            return `${fieldName} is required`;
        }
        else if (value.length != 10)
            return `Please enter a valid Contact Number `;

        return '';
    };
    const handleImageChange = (e) => {
        console.log("in file", e.target.files[0]);

        const file = e.target.files[0];
        setData({
            ...data,
            profilePic: file,
        });
    };
    const handleImageChange2 = (e) => {
        console.log("in file", e.target.files[0]);

        const file = e.target.files[0];
        setData({
            ...data,
            idProof: file,
        });
    };
    const handleSubmit = async (event) => {
        console.log("worked");
        event.preventDefault();

        let errors = {};
        let formIsValid = true;

        errors.email = validateField('Email', data.email);
        errors.password = validateField('Password', data.password);
        errors.fname = validateField('First Name', data.fname);
        errors.contact = validateContact('Contact', data.contact);
        errors.experience = validateField('Experience', data.experience);


        // errors.regno = validateField('Register Number', data.regno);
        errors.specialization = validateField('Specialization', data.specialization);
        errors.password = validateField('Password', data.password);
        // errors.cpassword = validateField('Confirm Password', data.cpassword);
        errors.contact = validateField2('contact', data.contact);
        errors.email = validateField3('email', data.email);
        errors.password = validateField3('password', data.password);

        errors.dob = validateField('Date Of Birth', data.dob);



        setErrors(errors);

        formIsValid = Object.values(errors).every((error) => error === ''); 

        if (!formIsValid) {
            console.log("Validation failed", errors);
            return; // Stop execution if there are validation errors
        }
        // if (formIsValid) {
        //     console.log("data", data);
            try {

                const result = await register(data, 'registerJudge');

                if (result.success) {
                    console.log(result);

                    toast.success('Registration successful!');
                    navigate('/co-view-judges');


                } else {
                    console.error('Registration error:', result);
                    toast.error(result.message);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                // toast.error('An unexpected error occurred during Registration');
            }
        // }
    };

    return (
        <>
            <div className=''>
                <div>
                    <h2 className="advocateRegistrationtitle">Add New Judge</h2>

                    <div className='row container-fluid'>


                        <div className='col-12  container-fluid mt-3'>
                            <form onSubmit={handleSubmit}>
                                <div className="row mt-5">


                                    <div className="col-6">

                                        <input
                                            type="text"
                                            class="form-control form-control-lg"
                                            id="exampleFormControlInput1"
                                            placeholder="First Name Here"
                                            value={data.fname}
                                            onChange={handleChange}

                                            name="fname"
                                        />{errors.fname && <div className="text-danger">{errors.fname}</div>}
                                    </div>



                                    <div className="col-6">

                                        <div >
                                            <input
                                                type="text"
                                                class="form-control  form-control-lg"
                                                id="exampleFormControlInput1"
                                                placeholder="Last Name Here"
                                                name="lname"
                                                value={data.lname}
                                                onChange={handleChange}

                                            /></div>

                                        {errors.lname && <div className="text-danger">{errors.lname}</div>}
                                    </div>


                                </div>
                                <div className='row mt-3'>

                                    <div className="col-6">
                                        <input
                                            type="email"
                                            class="form-control  form-control-lg"
                                            id="exampleFormControlInput1"
                                            placeholder="Email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                        />
                                    
                                    {errors.email && <div className="text-danger">{errors.email}</div>}

</div>
                                        <div className="col-6">
                                            <select
                                                placeholder="Specialization"
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

                                    <div className="row mt-3">


                                        <div className="col-6">

                                            <div >
                                                <input
                                                    type="number"
                                                    class="form-control  form-control-lg"
                                                    id="exampleFormControlInput1"
                                                    placeholder="Contact Number"
                                                    name="contact"
                                                    value={data.contact}
                                                    onChange={handleChange}
                                                    onBlur={() => setErrors(prevErrors => ({
                                                        ...prevErrors,
                                                        contact: validateContact('Contact', data.contact)
                                                    }))}
                                                /></div>
                                            {errors.contact && <div className="text-danger">{errors.contact}</div>}
                                        </div>

                                        <div className="col-6">

                                            <div >
                                                <input
                                                    type="date"
                                                    class="form-control  form-control-lg"
                                                    id="exampleFormControlInput1"
                                                    placeholder=""
                                                    name="dob"
                                                    value={data.dob}
                                                    max={new Date().toISOString().split("T")[0]}



                                                    onChange={handleChange}
                                                /></div>
                                            {errors.dob && <div className="text-danger">{errors.dob}</div>}
                                        </div>
                                    </div>

                                    <div className="row mt-3">







                                        <div className='col-6'>
                                            <input
                                                type="Number"
                                                class="form-control  form-control-lg"
                                                id="exampleFormControlInput1"
                                                placeholder="Experience"
                                                name="experience"
                                                value={data.experience}
                                                onChange={handleChange}
                                            /></div>
                                        {errors.experience && <div className="text-danger">{errors.experience}</div>}

                                        <div className="col-6">

                                            <input
                                                type="password"
                                                class="form-control form-control-lg"
                                                id="exampleFormControlInput1"
                                                placeholder="Password"
                                                name="password"
                                                value={data.password}
                                                onChange={handleChange}
                                            /> {errors.password && <div className="text-danger">{errors.password}</div>}
                                        </div>

                                    </div>

                                    <div className="row mt-3">

                                        <center> <button type="submit" className="btn btn-secondary w-50 advocateRegistrationbutton mt-3">
                                            Register
                                        </button> </center>

                                    </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}




export default COAddJudge