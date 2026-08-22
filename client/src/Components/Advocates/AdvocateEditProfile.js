import React, { useEffect, useState } from 'react'
import '../../Styles/AdvocateEditProfile.css'
import img from '../../Assets/advocateBanner.png'
import tick from '../../Assets/editPofileCheckmark.png'
import { toast } from "react-toastify";

import { IMG_BASE_URL } from "../Services/BaseURL";

import { useNavigate } from 'react-router-dom'
import { editByIdwithFile, ViewById } from '../Services/CommonServices';

function AdvocateEditProfile() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('advocate') == null) {
      navigate('/');
    }
  }, [navigate]);
    
    const id=localStorage.getItem('advocate') 
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

      const fetchdata = async () => {
        try {
          console.log("id",id);
          
            const result = await ViewById('viewAdvocateById',id);
  
            if (result.success) {
                console.log(result);
                setData(result.user||[]);
            } else {
                console.error('Advocate View Error :', result);
                // toast.error(result.message);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('An unexpected error occurred during login');
        }
      }
      useEffect(() => {
console.log('in use');

      
    

       
            fetchdata();
         
        }
          
      , [id]);
    
      const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
          setData(prevData => ({
             ...prevData, 
             [name]: files[0] 
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    
      function validateField(fieldName, value) {
        
        if (!(value)) {
          return `${fieldName} is required`;
        }
        return '';
      }
    
      function validateContact(fieldName, value) {
        if (!(value).toString().trim()) {
          return `${fieldName} is required`;
        } else if (value.length !== 10) {
          return 'Please enter a valid Contact Number';
        }
        return '';
      }

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        let errors = {};
        let formIsValid = true;
    
        errors.name = validateField('Full Name', data.name);
        errors.dob = validateField('Date of Birth', data.dob);
     
        // errors.contact = validateContact('Contact', data.contact);
        errors.email = validateField('Email', data.email);
        errors.password = validateField('Password', data.password);
        errors.bcNo = validateField('Bar Council Enrollment Number', data.bcNo);
      
        errors.specialization = validateField('Specialization Areas', data.specialization);
        console.log("data before",data.experience);
        errors.experience = validateField('Years of Experience', data.experience);
      
        // errors.profilePic = validateField('Profile Photo', data.profilePic ? data.profilePic.name : '');
        // errors.idProof = validateField('ID Proof Document', data.idProof ? data.idProof.name : '');
    
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
        
              const result = await editByIdwithFile('editAdvocateById',id,formData);
      
              if (result.success) {
                  console.log(result);
      
                  toast.success('Profile Updated successful!');
                  navigate('/advocate-home');
      
      
              } else {
                  console.error('Registration error:', result);
                  toast.error(result.message);
              }
          } catch (error) {
              console.error('Unexpected error:', error);
              toast.error('An unexpected error occurred ');
          }





            // try {
            //     const res = await axiosMultipartInstance.post(`/editAdvocateById/${id}`,formData);
            //     if (res.data.status === 200) {
            //         alert('Advocate profile updated successfully');
            //         window.location.reload();
            //     } else {
            //         alert(`Advocate Profile Update Failed: ${res.data.msg}`);
            //     }
            // } catch (error) {
            //     console.error('There was an error!', error);
            //     alert('Error updating advocate profile');
            // }
        }
    };
     

  return (
    <div>
      <div className='advocate_edit_profile'>
        <div className='container'>
            <div className='row '>
                <div className=' col-5 mt-5'> 
                    <div className='advocate_edit_profile_img d-flex justify-content-center'>
                        <img src={`${IMG_BASE_URL}/${data.profilePic.filename}`} className='img-fluid'/>
                    </div>
                    <p className='advocate_edit_profile_title mt-5' >Stay Ahead <span className='text-gold' >: Keep Your Profile Updated!</span></p>
                    <p className='advocate_edit_profile_sub_title mt-4' >Regularly updating your information ensures you;</p>
                    <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                        <img src={tick} className='img-fluid'/>
                        <p>Present your most recent experiences and specialization.</p>
                    </div>
                    <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                        <img src={tick} className='img-fluid'/>
                        <p>Reflect your ongoing professional devolepment and education.</p>
                    </div>
                    <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                        <img src={tick} className='img-fluid'/>
                        <p>Provide potential clients with up-to-date contact information.</p>
                    </div>
                    <div className='advocate_edit_profile_sub_title2 d-flex align-items-center'>
                        <img src={tick} className='img-fluid'/>
                        <p>Ensure accuracy in your areas of expertise and practice.</p>
                    </div>
                    
                </div>
                <div className='col-7'>
                <div className='container-fluid bckcolor'>
                  <div className=''>
                    <div className='container'>
                      <form onSubmit={handleSubmit}>
                        <div className="row mt-3">
                          <div className="col-sm-6 col-lg-6" >
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
                        <div className="row mt-2">
                          <div className="col-6">
                            <label className="form-label advocateRegistrationlabel">Date of Birth :</label>
                            {/* {console.log((data.dob).slice(0,10))} */}
                            <input
                              type="date"
                              className="form-control textbox-style"
                              name="dob"
                              value={(data.dob).slice(0,10)}
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
                     
                        <div className="row mt-2">
                                    
                        </div>
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
                            {/* {console.log(.filename)} */}
                            <label className="form-label advocateRegistrationlabel">Profile Photo :</label>
                            {console.log(data.profilePic)}
                            <input
                              type="file"
                              className="form-control textbox-style"
                              name="profilePic"
                              onChange={handleChange}
                            />
                            {errors.profilePic && <div className="text-danger">{errors.profilePic}</div>}
                          </div>
                        </div>
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
  )
}

export default AdvocateEditProfile
