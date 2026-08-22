import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IMG_BASE_URL } from '../Services/BaseURL';

import "../../Styles/User_BookAppoinment.css";
import { toast } from "react-toastify";
import { register, ViewById } from "../Services/CommonServices";


function User_BookAppoinment() {
  const [advocate, setAdvocate] = useState({
    profilePic: { filename: '' },
    idProof: { filename: '' },
    dob:''
  });
  const { id } = useParams();
  const { cid } = useParams();
  const userId = localStorage.getItem('user');

  console.log(cid);

  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      const result = await ViewById('viewAdvocateById',id);

      if (result.success) {
        console.log(result);

        setAdvocate(result.user || null);

      } else {

        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };
  useEffect(() => {

    fetchdata();
  }, [id]);







  const onSubmit = async () => {


    try {


      const result = await register({ userId: userId, caseId: cid, advocateId: advocate._id }, 'createAppointment');

      if (result.success) {
        console.log(result);
        toast.success("Appointment request created successfully");
        navigate('/user_view_case')


      } else {
        console.error('Registration error:', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
    }




  };

  // Function to determine if the file is an image
  const isImage = (filename) => {
    return /\.(jpg|jpeg|png|gif)$/.test(filename.toLowerCase());
  };

  // Function to determine if the file is a PDF
  const isPDF = (filename) => {
    return /\.pdf$/.test(filename.toLowerCase());
  };

  return (
    <div>
      <div className="junior-heading-div container-fluid">
        <label className="main-title">Advocate Details</label>
      </div>
      <div className="container-fluid mt-5 ">
        <div className="row justify-content-center">
          <div className="admin_view_junioradvocate_img col-lg-4 col-md-6 col-sm-12 text-center">
            <br />
            <img
              src={`${IMG_BASE_URL}/${advocate.profilePic.filename}`}
              className="img-fluid rounded image-size"
              alt="Advocate"
            />

            <label className="ju-advocate-name d-block mt-3">
              {advocate.name}
            </label>
            <label className="ju-practice-area d-block">
              {advocate.specialization}
            </label>
            <label className="client-view-ad-experiance d-block">
              {advocate.experience} Years of Experience in Various Cases
            </label>
            {/* <Link className="ju-link-label" to="#" data-toggle="modal" data-target="#idProofModal">
              View Id Proof
            </Link> */}
          </div>
          <div className="col-sm-6 col-lg-6">
            <div>
              <table className="table ju-custom-table">
                <tbody>

                  <tr>
                    <td className="left-alignn">
                      <label className="ju-sub-label">
                        Bar Council Enrollment Number
                      </label>
                    </td>
                    <td className="left-alignn">:</td>
                    <td className="left-alignn">
                      <label className="ju-sub-label">{advocate.bcNo}</label>
                    </td>
                  </tr>
                  
                
                  <tr>
                    <td className="left-alignn">
                      <label className="ju-sub-label">
                        Specialization Areas
                      </label>
                    </td>
                    <td className="left-alignn">:</td>
                    <td className="left-alignn">
                      <label className="ju-sub-label">
                        {advocate.specialization}
                      </label>
                    </td>
                  </tr>

              
                  <tr>
                    <td className="left-alignn">
                      <label className="ju-sub-label">Date Of Birth</label>
                    </td>
                    <td className="left-alignn">:</td>
                    <td className="left-alignn">
                      <label className="ju-sub-label">{advocate.dob.slice(0,10)}</label>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-alignn">
                      <label className="ju-sub-label">Email Address</label>
                    </td>
                    <td className="left-alignn">:</td>
                    <td className="left-alignn">
                      <label className="ju-sub-label">{advocate.email}</label>
                    </td>
                  </tr>
                  <tr>
                    <td className="left-alignn">
                      <label className="ju-sub-label">Contact Number</label>
                    </td>
                    <td className="left-alignn">:</td>
                    <td className="left-alignn">
                      <label className="ju-sub-label">{advocate.contact}</label>
                    </td>
                  </tr>
                 
                </tbody>
              </table>
              <br />
              <div className="appoinment-btn-div">
                <button className="btn btn-warning button-style-appoinment" onClick={onSubmit} >
                  Book an Appoinment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="idProofModal" tabIndex="-1" role="dialog" aria-labelledby="idProofModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="idProofModalLabel">ID Proof</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {isImage(advocate.idProof.filename) && (
                <img src={`${IMG_BASE_URL}/${advocate.idProof.filename}`} className="img-fluid" alt="ID Proof" />
              )}
              {isPDF(advocate.idProof.filename) && (
                <iframe
                  src={`${IMG_BASE_URL}/${advocate.idProof.filename}`}
                  className="embed-responsive-item"
                  style={{ width: '100%', height: '500px' }}
                  title="ID Proof"
                ></iframe>
              )}
              {!isImage(advocate.idProof.filename) && !isPDF(advocate.idProof.filename) && (
                <p>Unsupported file type</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User_BookAppoinment;
