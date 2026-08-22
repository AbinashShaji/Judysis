import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import img from "../../../Assets/image 21.png";
import {IMG_BASE_URL} from '../../Services/BaseURL' 
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { ViewById } from "../../Services/CommonServices";
function AdminViewSingleUsers() {

    const [advocate, setAdvocate] = useState({
      profilePic:{filename:''},
      dob:''
    });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  const handleApprove = async(id) => {
    try {
      const result = await approveById('approveUserById',id);

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
      const result = await approveById('rejectUserById',id);

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
        const result = await ViewById('viewUserById',id);

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
  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="admin_view_advocate_img col-lg-4 col-md-6 col-sm-12 text-center">
          <img src={`${IMG_BASE_URL}/${advocate.profilePic.filename}`} className="img-fluid rounded" alt="Advocate" />
          <br />
          <label className="advocate-name d-block mt-3">{advocate.name}</label>
         
          <br />
        
        </div>
        <div className="col-lg-8 col-md-6 col-sm-12 ">
          <div>
            <table className="table custom-table">
              <tbody>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Name </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.name}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Email </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.email}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.contact}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Gender </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.gender}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">City </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.city} </label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Date Of Birth </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.dob.slice(0,10)}</label>
                  </td>
                </tr>
            
              </tbody>
            </table>
          </div>
        </div>
      </div>

    

    </div>
  )
}

export default AdminViewSingleUsers
