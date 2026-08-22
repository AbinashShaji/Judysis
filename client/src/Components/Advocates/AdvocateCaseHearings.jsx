import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { register, ViewById } from "../Services/CommonServices";
import "../../Styles/UserAddCases.css";

function AdvocateCaseHearings() {
  const { id } = useParams();
  const [hearings, setHearings] = useState([]);
  
  
  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const result = await ViewById("getStatusByCaseId", id);
        if (result.success) {
          
          setHearings(result.user || []);
         
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching hearings:", error);
        toast.error("Failed to load hearings");
      }
    };

    fetchHearings();
  }, [id]);





  return (
    <div className="container adv-case-hearing">
      <div className="case-hearings container mt-5 p-2">
       <center> <h2 className="mb-5">Case Hearings</h2></center>
          
        
          {hearings.length > 0 ? (
              <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Sl. No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Next Hearing Date</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {hearings.map((caseReq, index) => (
                  <tr key={caseReq?._id}>
                    <td>{index + 1}</td>
                    <td>{caseReq?.date
                        ? caseReq.date.slice(0, 10)
                        : "N/A"}</td>
                    <td>{caseReq?.status
                        ? caseReq.status.slice(0, 10)
                        : "N/A"}</td>
                    <td>
                      {caseReq?.hearingDate
                        ? caseReq.hearingDate.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td title={caseReq?.description}>{caseReq?.description?.slice(0, 50)}...</td>

                
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
<p className="fw-bold fs-4">No hearing Updates available for this case.</p>
          )}
       
        </div>
       
    </div>
  );
}

export default AdvocateCaseHearings;
