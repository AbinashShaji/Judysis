import React, { useEffect, useState } from 'react';
import tick from '../../Assets/editPofileCheckmark.png';
import { toast } from "react-toastify";
import { IMG_BASE_URL } from '../Services/BaseURL';
import { useNavigate } from 'react-router-dom';
import { editByIdwithFile, ViewById } from '../Services/CommonServices';

function UserProfile() {

    const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user') == null) {
      navigate('/');
    }
  }, [navigate]);

  const id = localStorage.getItem('user');

    const [data, setData] = useState({
        name: '',
        contact: '',
        email: '',
        city: '',
        gender: '',
        dob: '',
        profilePic: null, 
        aadhar: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        contact: '',
        email: '',
        city: '',
        gender: '',
        dob: '',
        profilePic: '',
        aadhar: '',
    });
    const fetchData = async () => {
        try {
            const result = await ViewById('viewUserById',id);
            console.log(result);
            if (result.success) {
              
                   setData(result.user)
            
  
             
            } else {
              console.error('Login error:', result);
              toast.error(result.message);
            }
          } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('An unexpected error occurred during login');
          }
    };
    useEffect(() => {
     
        if(id!==null){
            fetchData();
          }
    }, []);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            setData(prevData => ({
                ...prevData,
                [name]: files[0],
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    function validateField(fieldName, value) {
        if (!value.trim()) {
            return `${fieldName} is required`;
        }
        return '';
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let errors = {};
        let formIsValid = true;

        // Validate each field
        errors.name = validateField('Full Name', data.name);
        errors.contact = validateField('Contact Number', data.contact);
        errors.email = validateField('Email', data.email);
        errors.address = validateField('City', data.city);
        errors.gender = validateField('Gender', data.gender);
        errors.dob = validateField('Date of Birth', data.dob);
        errors.nationality = validateField('Aadhar', data.aadhar);

        setErrors(errors);

        for (let key in errors) {
            if (errors[key]) {
                formIsValid = false;
                break;
            }
        }

        if (formIsValid) {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('contact', data.contact);
            formData.append('email', data.email);
            formData.append('city', data.city);
            formData.append('gender', data.gender);
            formData.append('dob', data.dob);
            if (data.profilePic) {
                formData.append('profilePic', data.profilePic);
            }
            formData.append('aadhar', data.aadhar);


            try {
                const result = await editByIdwithFile('editUserById',id,formData);
                console.log(result);
                if (result.success) {
                  
                       setData(result.user)
                    
                       toast.success('Your Profile has been updated successfully');
                       fetchData();

                } else {
                  console.error(' error:', result);
                  toast.error(`User Profile Update Failed: ${result.message}`);
                }
              } catch (error) {
                console.error('Unexpected error:', error);
                toast.error('An unexpected error occurred during Update Profile');
              }

          
        }
    };

    return (
        <div className='advocate_edit_profile'>
            <div className='container'>
                <div className='row'>
                    <div className='col-5 mt-5'>
                        <div className='advocate_edit_profile_img d-flex justify-content-center'>
                            {data.profilePic && (
                                <img src={`${IMG_BASE_URL}/${data.profilePic.filename}`} className='img-fluid' alt='Profile' />
                            )}
                        </div>
                        <p className='advocate_edit_profile_title mt-5'>Stay Ahead <span className='text-gold'>: Keep Your Profile Updated!</span></p>
                        <p className='advocate_edit_profile_sub_title mt-4'>Regularly updating your information ensures you;</p>
                        <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                            <img src={tick} className='img-fluid' alt='Checkmark' />
                            <p  className='ps-2'>Keep Your Messaging focussed.</p>
                        </div>
                        <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                            <img src={tick} className='img-fluid' alt='Checkmark' />
                            <p  className='ps-2'>Document and share your profiles.</p>
                        </div>
                        <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                            <img src={tick} className='img-fluid' alt='Checkmark' />
                            <p  className='ps-2'>Connect with Your clients.</p>
                        </div>
                        <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                            <img src={tick} className='img-fluid' alt='Checkmark' />
                            <p className='ps-2'>Build up Trust.</p>
                        </div>
                    </div>
                    <div className='col-7'>
                        <div className='container-fluid bckcolor'>
                            <div className=''>
                                <div className='container'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='row mt-3'>
                                            <div className='col-sm-6 col-lg-6'>
                                                <label className='form-label advocateRegistrationlabel'>Full Name :</label>
                                                <input
                                                    type='text'
                                                    className='form-control textbox-style'
                                                    placeholder='Enter your Full Name'
                                                    name='name'
                                                    value={data.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && <div className='text-danger'>{errors.name}</div>}
                                            </div>
                                            <div className='col-6'>
                                                <label className='form-label advocateRegistrationlabel'>Contact Number :</label>
                                                <input
                                                    type='text'
                                                    className='form-control textbox-style'
                                                    placeholder='Enter your contact number'
                                                    name='contact'
                                                    value={data.contact}
                                                    onChange={handleChange}
                                                />
                                                {errors.contact && <div className='text-danger'>{errors.contact}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-6'>
                                                <label className='form-label advocateRegistrationlabel'>Date of Birth :</label>
                                                <input
                                                    type='date'
                                                    className='form-control textbox-style'
                                                    name='dob'
                                                    value={(data.dob).slice(0,10)}
                                                    onChange={handleChange}
                                                />
                                                {errors.dob && <div className='text-danger'>{errors.dob}</div>}
                                            </div>
                                            <div className='col-6'>
                                                <label className='form-label advocateRegistrationlabel'>Aadhar Number :</label>
                                                <input
                                                    type='text'
                                                    className='form-control textbox-style'
                                                    placeholder='Enter your Aadhar Number'
                                                    name='aadhar'
                                                    value={data.aadhar}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                                {errors.aadhar && <div className='text-danger'>{errors.aadhar}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-12'>
                                                <label className='form-label advocateRegistrationlabel'>Email :</label>
                                                <input
                                                    type='email'
                                                    className='form-control textbox-style'
                                                    placeholder='Enter your Email'
                                                    name='email'
                                                    value={data.email}
                                                    onChange={handleChange}
                                                />
                                                {errors.email && <div className='text-danger'>{errors.email}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-3'>
                                            <div className='col-12'>
                                                <label className='form-label advocateRegistrationlabel'>City :</label>
                                                <input
                                                    type='text'
                                                    className='form-control textbox-style'
                                                    placeholder='Enter your city'
                                                    name='city'
                                                    value={data.city}
                                                    onChange={handleChange}
                                                />
                                                {errors.city && <div className='text-danger'>{errors.city}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-3'>
                                            <div className='col-12'>
                                                <label className='form-label advocateRegistrationlabel'>Gender :</label>
                                                <select
                                                    className='form-control textbox-style'
                                                    name='gender'
                                                    value={data.gender}
                                                    onChange={handleChange}
                                                >
                                                    <option value=''>Select Gender</option>
                                                    <option value='male'>Male</option>
                                                    <option value='female'>Female</option>
                                                    <option value='other'>Other</option>
                                                </select>
                                                {errors.gender && <div className='text-danger'>{errors.gender}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-3'>
                                            <div className='col-12'>
                                                <label className='form-label advocateRegistrationlabel'>Profile Picture :</label>
                                                <input
                                                    type='file'
                                                    className='form-control'
                                                    name='profilePic'
                                                    onChange={handleChange}
                                                />
                                                {errors.profilePic && <div className='text-danger'>{errors.profilePic}</div>}
                                            </div>
                                        </div>
                                        <div className='row mt-3'>
                                            <div className='col-12'>
                                                <button type='submit' className='btn btn-warning'>Update</button>
                                                
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
    );
}

export default UserProfile;
