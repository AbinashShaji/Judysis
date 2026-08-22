import React, { useEffect, useState } from "react";
import "../../../Styles/ViewAllAdvocates.css";
import img from "../../../Assets/Vecto(2).png";
import img1 from "../../../Assets/Vectorsymbol.png";
import img2 from "../../../Assets/raphael_cross.png";
import { Link, useNavigate } from "react-router-dom";
import noReqFound from "../../../Assets/noReqFound.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
function AdminViewAdvReqs() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  const [data, setData] = useState([]);


  const fetchdata = async () => {
    try {
      const result = await viewCount("viewAdvocateReqs");

      if (result.success) {
        console.log(result);
        // if (result.user.length >= 0) setData(result.user || []);
        // else setData([]);
        setData(result.user.length > 0 ? [...result.user] : []);
      } else {
        console.error(" View Error :", result);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);


  const handleApprove = async (id) => {
    try {
      const result = await approveById("approveAdvocateById", id);
  
      if (result.success) {
        console.log(result);
        toast.success("Approved Successfully");
        // fetchdata();
        setData((prevData) => prevData.filter((advocate) => advocate._id !== id));  
      } else {
        console.error("View Error :", result);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  

  const handleReject = async (id) => {
    try {
      const result = await approveById("rejectAdvocateById", id);

      if (result.success) {
        console.log(result);
        // fetchdata();
        setData((prevData) => prevData.filter((advocate) => advocate._id !== id));
      } else {
        console.error(" View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);
  
  return (
    <div className="main-div">
      {data?.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead className="admin-tab-head">
              <tr>
                <th className="table-header admin-tab-head-text">BC No</th>
                <th className="table-header admin-tab-head-text"> Name</th>
                <th className="table-header">Specialization</th>
                <th className="table-header">E-Mail</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Years of Experience</th>
                <th className="table-header">View More</th>
                <th className="table-header">Approve</th>
                <th className="table-header">Remove</th>
              </tr>
            </thead>
            <tbody>
              {data&&data?.length ? (
                data.map((advocate) => (
                  <tr key={advocate._id}>
                    <td className="table-data">{advocate.bcNo}</td>
                    <td className="table-data">{advocate.name}</td>
                    <td className="table-data">{advocate.specialization}</td>
                    <td className="table-data">{advocate.email}</td>
                    <td className="table-data">{advocate.contact}</td>
                    <td className="table-data">{advocate.experience} years</td>
                    <td className="table-data">
                      <Link to={`/adminviewrequest/${advocate._id}`}>
                        <button className="btn1 btn btn-outline-secondary">
                          <img src={img} alt="View Details" />
                        </button>
                      </Link>
                    </td>
                    <td className="table-data">
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleApprove(advocate._id)}
                      >
                        <img src={img1} alt="Approve Advocate" />
                      </button>
                    </td>
                    <td className="table-data">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleReject(advocate._id)}
                      >
                        <img src={img2} alt="Reject Advocate" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Data obtained
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-advocates">
          <h1>No New Requests</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewAdvReqs;
