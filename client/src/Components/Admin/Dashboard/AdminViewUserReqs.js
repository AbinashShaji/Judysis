

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link, useNavigate } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css'
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
function AdminViewUserReqs() {

    const navigate = useNavigate();

    useEffect(() => {
      if (localStorage.getItem("admin") == null) {
        navigate("/");
      }
    }, [navigate]);
  
    const [data, setData] = useState([]);
  
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
        toast.error('An unexpected error occurred view Users');
    }
      
    };
  
    const handleReject =async (id) => {
      try {
        const result = await approveById('rejectUserById',id);
  
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
    const fetchdata = async () => {
      try {
          const result = await viewCount('viewUsersForAdmin');
  
          if (result.success) {
              console.log(result);
              if(result.user.length>0)
              setData(result.user);
            else
            setData([])
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
    }, []);
    return (
      <div className="main-div">
        {data.length !== 0 ? (
          <>
            <h3 className="mt-5 mb-3">New Users</h3>
            <div className="table-container table-striped">
              <table className="container-fluid">
                <thead className="thead-dark">
                  <tr>
                    <th className="table-header fw-bolder">Name</th>
                    <th className="table-header  fw-bolder">Email</th>
                    <th className="table-header  fw-bolder">Contact</th>
                    <th className="table-header  fw-bolder">Aadhar Number</th>
                    <th className="table-header  fw-bolder">City</th>
                    <th className="table-header  fw-bolder">Profile</th>
                    <th className="table-header  fw-bolder">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length ? (
                    data.map((user) => (
                      <tr>
                        <td className="table-data">{user.name}</td>
                        <td className="table-data">{user.email}</td>
                        <td className="table-data">{user.contact}</td>
                        <td className="table-data">{user.aadhar}</td>
                        <td className="table-data"> {user.city}</td>
                        <td className="table-data">
                          <Link to={`/admin_view_single_user/${user._id}`}>
                            <button className="btn1 btn btn-outline-secondary p-1">
                              <img src={img} alt="View Details" />
                            </button>
                          </Link>
                        </td>{" "}
                        {console.log(user.isActive)}
                        <td className="table-data">
                          <button
                            className="btn btn-outline-success button-size p-1  ms-3"
                            onClick={() => handleApprove(user._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-outline-danger button-size p-1  ms-3"
                            onClick={() => handleReject(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h1>No Data obtained</h1>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-advocates">
            <h1>No New Requests</h1>
          </div>
        )}
      </div>
    );
}




export default AdminViewUserReqs