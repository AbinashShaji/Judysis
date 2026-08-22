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

function COViewAlljudges() {
 
      const navigate = useNavigate();
    
      useEffect(() => {
        if (localStorage.getItem("court") == null) {
          navigate("/");
        }
      }, [navigate]);
    
      const [data, setData] = useState([]);
    
      const handleActivate = async(id) => {
        try {
          const result = await approveById('activateJudgeById',id);
    
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
          const result = await approveById('deactivateJudgeById',id);
    
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
            const result = await viewCount('viewJudges');
    
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
          <h3 className="admin-user-req-link"><Link to='/co-add-judge' className="admin-user-req-linkh3" >Add New Judge</Link></h3>

          {data.length !== 0 ? (
            <>
                                <h2 className="advocateRegistrationtitle">View All Judges</h2>

            <div className="table-container table-striped">
              <table className="table-change container-fluid">
                <thead className="admin-tab-head">
                  <tr>
                    
                    <th className="table-header admin-tab-head-text"> Name</th>
                    <th className="table-header">Specialization</th>
                    <th className="table-header">E-Mail</th>
                    <th className="table-header">Contact</th>
                    <th className="table-header">Years of Experience</th>
                    <th className="table-header">View More</th>
                    <th className="table-header">Action</th>
               
                  </tr>
                </thead>
                <tbody>
                  {data.length ? (
                    data.map((advocate) => (
                      <tr key={advocate._id}>
                      
                        <td className="table-data">{advocate.name}</td>
                        <td className="table-data">{advocate.specialization}</td>
                        <td className="table-data">{advocate.email}</td>
                        <td className="table-data">{advocate.contact}</td>
                        <td className="table-data">{advocate.experience} years</td>
                        <td className="table-data">
                          <Link to={`/co-view-single-judge/${advocate._id}`}>
                            <button className="btn1 btn btn-outline-secondary ">
                              <img src={img} alt="View Details" />
                            </button>
                          </Link>
                        </td>
                        <td className="table-data">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size p-2"
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size p-2"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No Data obtained</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <div className="no_data_animation">
              <Lottie animationData={noReqFound} className="no_data_animation" />
              <h1 className="text-center">No New Requests</h1>
            </div>
          )}
        </div>
      );
    }
 
    
export default COViewAlljudges