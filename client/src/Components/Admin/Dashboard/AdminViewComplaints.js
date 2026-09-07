/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW COMPLAINTS (AdminViewComplaints.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of grievances, reports, and complaints submitted
 * by any role in the system (Citizens/Clients, Advocates, Interns, Junior Advocates).
 * The administrator can inspect:
 *   - Submission Date
 *   - Submitter Role / User Type ('Client', 'Advocate', 'Intern', 'Junior Advocate')
 *   - Submitter Name
 *   - Complaint message body
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when `data === "complaints"`.
 * - Dynamically checks which user reference exists on each complaint record
 *   (`userId`, `advId`, `internId`, `jrId`) to correctly display the author's role
 *   and name.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

/**
 * AdminViewComplaints Component
 * -----------------------------
 * Displays user complaints filed across all user roles in a centralized table.
 */
function AdminViewComplaints() {
  // State storing the list of submitted complaints
  const [data, setData] = useState([]);

  // Hook placeholder: Calls POST "/viewAllComplaints" to load complaint records from the backend
  // useEffect(() => {
  //   axiosInstance
  //     .post("/viewAllComplaints")
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         console.log(res);
  //         setData(res.data.data || []);
  //       } else {
  //         setData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error!", error);
  //     });
  // }, []);

  return (
    <div className="main-div">
      {/* Check if complaint records exist */}
      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">User Type</th>
                <th className="table-header">User Name</th>
                <th className="table-header">Complaint</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((complaintItem, index) => (
                  <tr key={complaintItem._id || index}>
                    <td className="table-data">{complaintItem.date?.slice(0, 10)}</td>
                    
                    {/* Determine the author's role */}
                    <td className="table-data">
                      {complaintItem.userId
                        ? 'Client'
                        : complaintItem.advId
                        ? 'Advocate'
                        : complaintItem.internId
                        ? 'Intern'
                        : complaintItem.jrId
                        ? 'Junior Advocate'
                        : ""}
                    </td>

                    {/* Determine the author's full legal name */}
                    <td className="table-data">
                      {complaintItem.userId
                        ? complaintItem.userId.name
                        : complaintItem.advId
                        ? complaintItem.advId.name
                        : complaintItem.internId
                        ? complaintItem.internId.name
                        : complaintItem.jrId
                        ? complaintItem.jrId.name
                        : ""}
                    </td>

                    {/* Complaint Message Text */}
                    <td className="table-data">{complaintItem.complaint}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <h1>No Data obtained</h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State Illustration */
        <div className="no_data_animation">
          <Lottie animationData={noData} className="no_data_animation" />
        </div>
      )}
    </div>
  );
}

export default AdminViewComplaints;
