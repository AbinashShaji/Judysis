import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../Styles/ViewProfile_AR.css";
import img from "../../../Assets/image 21.png";
import {IMG_BASE_URL} from '../../Services/BaseURL' 
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { ViewById } from "../../Services/CommonServices";
function ViewProfile_AR({ view }) {
  const [advocate, setAdvocate] = useState(null);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  const handleApprove = async(id) => {
    try {
      const result = await approveById('approveAdvocateById',id);

      if (result.success) {
          console.log(result);
         fetchdata()
      } else {
          console.error('View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
    
  };

  const handleReject =async (id) => {
    try {
      const result = await approveById('rejectAdvocateById',id);

      if (result.success) {
          console.log(result);
      
      } else {
          console.error(' View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
  };
  const fetchdata = async () => {
    try {
        const result = await ViewById('viewAdvocateById',id);

        if (result.success) {
            console.log(result);
            if(result.user)
              setAdvocate(result.user);
          else
          setAdvocate({})
        } else {
            console.error('Village Office View Error :', result);
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

  const handleActivate = async(id) => {
    try {
      const result = await approveById('activateAdvocateById',id);

      if (result.success) {
          console.log(result);
         fetchdata()
      } else {
          console.error('View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
    
  };

  const handleDeactivate =async (id) => {
    try {
      const result = await approveById('deactivateAdvocateById',id);

      if (result.success) {
          console.log(result);
        fetchdata()
      } else {
          console.error(' View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
  };
  const toggleModal = () => setShowModal(!showModal);

  if (!advocate) {
    return "";
  }

  return (
    <div className="container-fluid mt-4 ms-3">
      <div className="row justify-content-center mt-5">
        <div className="admin_view_advocate_img col-lg-4 col-md-6 col-sm-12 text-center">
          <img src={`${IMG_BASE_URL}/${advocate.profilePic.filename}`} className="img-fluid rounded" alt="Advocate" />
          <br />
          <label className="advocate-name d-block mt-3">{advocate.name}</label>
          <label className="practice-area d-block">{advocate.specialization}</label>
          <label className="experience-label d-block">
            {advocate.experience} Years of Experience 
          </label>
          <br />
          <Link className="link-label" to="#!" onClick={toggleModal}>
            View Id Proof
          </Link>
        </div>
        <div className="col-lg-8 col-md-6 col-sm-12 ">
          <div>
            <table className="table custom-table">
              <tbody>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Bar Council Enrollment Number </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.bcNo}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">E-Mail </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.email}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.contact}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Area </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.specialization}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.experience} years</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Date Of Birth</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.dob.slice(0,10)}</label>
                  </td>
                </tr>
                 

                {view === "view" ? (
                  <div className="row justify-content-center mt-4 arr">
                    <div className="col-auto">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size1"
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size1"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                ) : view === "request" ? (
                  <div className="row justify-content-center mt-4 arr">
                    <div className="col-auto">
                      <button
                        className="btn btn-warning btn-style  me-2"
                        onClick={() => handleApprove(advocate._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-style btn-warning"
                        onClick={() => handleReject(advocate._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">ID Proof</h5>
              <button type="button" className="close" onClick={toggleModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img src={`${IMG_BASE_URL}/${advocate.idProof.filename}`} className="img-fluid" alt="ID Proof" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show" />}
    </div>
  );
}

export default ViewProfile_AR;
