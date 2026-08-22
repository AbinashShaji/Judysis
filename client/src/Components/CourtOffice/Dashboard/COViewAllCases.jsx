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

function COViewAllCases() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  const [data, setData] = useState([]);

  const redirect = async (id) => {
   navigate(`/co-view-singleCase/${id}`)

  };

  
  const fetchdata = async () => {
    try {
      const result = await viewCount('getCaseAdvStatus');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
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
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead className="admin-tab-head">
              <tr>

                <th className="table-header admin-tab-head-text"> SlNo</th>
                <th className="table-header">Title</th>
                <th className="table-header">Description</th>
                <th className="table-header">Case Type</th>
                <th className="table-header">Date of Incident</th>
                <th className="table-header">User Name</th>
                
                <th className="table-header">Advocate Name</th>
                <th className="table-header">Action</th>

              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((advocate,index) => (
                  <tr key={advocate._id}>
                    <td className="table-data">{index+1}</td>
                    <td className="table-data">{advocate.title}</td>
                    <td className="table-data">{advocate.description}</td>
                    <td className="table-data">{advocate.type}</td>
                    <td className="table-data">{advocate.dateOfIncident.slice(0,10)}</td>
                    <td className="table-data">{advocate.userId.name}</td>
                    <td className="table-data">{advocate.advocateId.name} </td>
                    
                    <td className="table-data">
                
                        
                        <button
                          className="btn btn-outline-success button-size w-100"
                          onClick={() => redirect(advocate._id)}
                        >
                          View More
                        </button>
                      
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
      ) : (
        <div className="no_data_animation">
          {/* <Lottie animationData={noReqFound} className="no_data_animation" /> */}
          <h1 className="text-center">No New Requests Found</h1>
        </div>
      )}
    </div>
  );
}


export default COViewAllCases