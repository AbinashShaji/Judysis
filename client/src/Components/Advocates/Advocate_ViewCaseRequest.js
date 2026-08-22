import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../../Styles/Advocate_ViewCaseRequest.css';
import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react"; 
import { ViewById } from "../Services/CommonServices";
import { toast } from "react-toastify";

function Advocate_ViewCaseRequest() {
  const [data, setData] = useState([]);
  const id=localStorage.getItem('advocate');


  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id",id);
        
          const result = await ViewById('getAppointmentReqsForAdv',id);

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
  };
  fetchdata();
  }, [id]);





  console.log(data); 


  return (
    <div>
      <div className="junior-heading-div container-fluid">
        <label className="main-title">Case Request</label>
      </div>
      <div className="main-div">
        {data.length !== 0 ? (
          <div className="table-container table-striped">
            <table className="table-change container-fluid">
              <thead>
                <tr>
                  <th className="table-header">Case Title</th>
                  <th className="table-header">Client Name</th>
                  <th className="table-header">Phone Number</th>
                  <th className="table-header">Case Type</th>
                  <th className="table-header">Date of Incident</th>
                  <th className="table-header">Opponent Name</th>
                  <th className="table-header">Opponent Details</th>
                  <th className="table-header">Case Location</th>
                  <th className="table-header"> </th>
                </tr>
              </thead>
              <tbody>
                {data.length ? (
                  data.map((caseReq) => (
                    <tr>
                      <td className="table-data">
                        {caseReq.caseId?.title || "N/A"}
                      </td>
                      <td className="table-data">
                        {caseReq.userId?.name || "N/A"}
                      </td>
                      <td className="table-data">
                        {caseReq.userId?.contact || "N/A"}
                      </td>
                      <td className="table-data">
                        {caseReq.caseId?.type || "N/A"}
                      </td>
                      <td className="table-data">
                        {caseReq.caseId?.dateOfIncident
                          ? caseReq.caseId.dateOfIncident.slice(0, 10)
                          : "N/A"}
                      </td>
                      <td className="table-data">
                        {caseReq.caseId?.opponentName || "Unknown"}
                      </td>
                      <td className="table-data">
                        {caseReq.caseId?.opponentAddress || "Unknown"}
                      </td>
                      <td className="table-data">
                        {caseReq.caseId?.location || "N/A"}
                      </td>

                      <td className="table-data">
                        <Link
                          to={`/advocate_view_single_case_req/${caseReq._id}`}
                        >
                          <button className="btn btn-outline-secondary">
                            View Details
                          </button>
                        </Link>
                      </td>
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
            {/* <Lottie animationData={noData} className="no_data_animation" /> */}
            <h1 className="text-center">No Recent Cases</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Advocate_ViewCaseRequest;
