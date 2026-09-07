/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW ACTIVE JUDGES (AdminViewJudjes.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of all active Judges serving across the court system.
 * The administrator can inspect:
 *   - Judge's full legal name
 *   - Official email address
 *   - Direct contact phone number
 *   - Years of judicial bench experience
 *   - Legal specialization area (Criminal, Family, Civil, Cyber, etc.)
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin_view_judges`
 *   (accessed via the "View Judges" link in `AdminSidebar.js`).
 * - On component mount (`useEffect`), sends a POST request to `viewActiveJudges`.
 * - Populates the table with all judges who have active judicial status in MongoDB.
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Services/BaseURLMain';
import { useNavigate } from 'react-router-dom';

/**
 * AdminViewJudjes Component
 * -------------------------
 * Renders the tabular list of all active judicial officers.
 */
function AdminViewJudjes() {
  const navigate = useNavigate();

  /**
   * Effect Hook: Route Guard
   * ------------------------
   * Ensures only logged-in administrators can view judicial rosters.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the list of active judges
  const [data, setData] = useState([]);

  /**
   * Effect Hook: Fetch Active Judges
   * --------------------------------
   * Calls POST `viewActiveJudges` on mount to retrieve all appointed judges.
   */
  useEffect(() => {
    axiosInstance.post(`viewActiveJudges`)
      .then((result) => {
        console.log(result);
        setData(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="main-div">
      {/* Check if any judge records exist */}
      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header fw-bold">Name</th>
                <th className="table-header fw-bold">Email</th>
                <th className="table-header fw-bold">Contact</th>
                <th className="table-header fw-bold">Experience</th>
                <th className="table-header fw-bold">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {data?.length ? (
                data?.map((judge) => (
                  <tr key={judge._id}>
                    <td className="table-data">{judge?.name}</td>
                    <td className="table-data">{judge.email}</td>
                    <td className="table-data">{judge.contact}</td>
                    <td className="table-data">{judge.experience}</td>
                    <td className="table-data">{judge.specialization}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <h1>No Data obtained</h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="no_cases">
          <h2>No judges</h2>
        </div>
      )}
    </div>
  );
}

export default AdminViewJudjes;