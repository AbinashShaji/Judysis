// UserViewHearingDetails.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchHearingsByCaseId } from "../Services/CommonServices"; // Import common fetch function
import "../../Styles/UserAddCases.css";
import ReactStars from "react-rating-stars-component";

function UserViewHearingDetails() {
  const { id } = useParams();
  const [hearings, setHearings] = useState([]);
  const [rating, setRating] = useState(0);
  const [advId, setAdvId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHearings = async () => {
      try {
        const hearingsData = await fetchHearingsByCaseId(id);  // Use common fetch function
        setHearings(hearingsData);
        if (hearingsData.length > 0) {
          setRating(hearingsData[0].rating);
          setAdvId(hearingsData[0].advocateId._id);
        }
      } catch (error) {
        toast.error("Failed to load hearings");
      }
    };

    fetchHearings();
  }, [id]);

  useEffect(() => {
    if (localStorage.getItem('user') == null) {
      navigate('/');
    }
  });

 

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
                    <td>{caseReq?.date ? caseReq.date.slice(0, 10) : "N/A"}</td>
                    <td>{caseReq?.status ? caseReq.status.slice(0, 10) : "N/A"}</td>
                    <td>{caseReq?.hearingDate ? caseReq.hearingDate.slice(0, 10) : "N/A"}</td>
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

export default UserViewHearingDetails;
