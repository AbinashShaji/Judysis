import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../../Styles/Advocate_ViewCaseRequest.css';
import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react"; 
import { ViewById } from "../Services/CommonServices";
import { toast } from "react-toastify";

function AdvocateViewAprvdCases() {
  const [data, setData] = useState([]);
  const id=localStorage.getItem('advocate');


  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id",id);
        
          const result = await ViewById('getApprovedAppointmentsForAdv',id);

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
      <div className='junior-heading-div container-fluid'>
        <label className='main-title'>Case Request</label>
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
                    <td className="table-data">{caseReq.caseId.title}</td>
                    <td className="table-data">{caseReq.userId.name}</td>
                    <td className="table-data">{caseReq.userId.contact}</td>
                    <td className="table-data">{caseReq.caseId.type}</td>
                    <td className="table-data">{caseReq.caseId.dateOfIncident.slice(0,10)}</td>
                    <td className="table-data">{caseReq.caseId.opponentName?caseReq.caseId.opponentName:'Unknown'}</td>
                    <td className="table-data">{caseReq.caseId.opponentAddress?caseReq.caseId.opponentAddress:'Unknown'}</td>
                    <td className="table-data">{caseReq.caseId.location}</td>
                    <td className="table-data">
                    <Link to={`/single_aprvd_case_req/${caseReq._id}`}>
                      
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
        <div className="no_data_animation">
          <Lottie animationData={noData} className="no_data_animation" />
        </div>
      )}
    </div>
    </div>
  );
}

export default AdvocateViewAprvdCases;
