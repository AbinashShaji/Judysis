import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";

import { toast } from "react-toastify";
import { viewCount } from "../../Services/AdminService";
function AdminViewFeedbacks() {

    const [data, setData] = useState([]);

    const fetchdata = async () => {
        try {
            const result = await viewCount('viewAllfeedbacks');
    
            if (result.success) {
                console.log(result);
                if(result.user.length>0)
                setData(result.user);
              else
              setData([])
            } else {
                console.error('View Error :', result);
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
            <thead>
              <tr>
                <th className="table-header fw-bold">Sl No</th>
                <th className="table-header fw-bold">User Name</th>
                
                <th className="table-header fw-bold">Feedback</th>
                <th className="table-header fw-bold">Date Added</th>
              
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((advocate,index) => (
                  <tr>
                    <td className="table-data">{index+1}</td>
                    <td className="table-data">{advocate.userId.name}</td>
                    <td className="table-data">{advocate.feedback}</td>
                    <td className="table-data">{advocate.date.slice(0,10)}</td>
                    
                  
                    {/* <td className="table-data">
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
                    </td> */}
                  </tr>
                ))
              ) : (
                <h1>No Data obtained</h1>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-cases">
          <h1>No feedbacks</h1>
          
        </div>
      )}
      
    </div>
  )
}

export default AdminViewFeedbacks
