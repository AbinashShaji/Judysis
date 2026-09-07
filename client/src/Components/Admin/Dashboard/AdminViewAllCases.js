/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW ALL CASES (AdminViewAllCases.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of all court lawsuits filed across the JudiSys system.
 * The administrator can inspect:
 *   - Case Title
 *   - Legal Case Type (e.g., Civil, Criminal, Family)
 *   - Date of Incident
 *   - Petitioner (Citizen) Name
 *   - Assigned Advocate (Lawyer) Name (or '-' if none assigned)
 *   - "Details" button to open the full case facts and hearing history
 *     (`AdminViewSingleCase.js`).
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin_view_cases`
 *   (accessed via the "Cases" menu item in `AdminSidebar.js`).
 * - On component mount (`useEffect`), calls `viewCount('getAllCases')` to fetch all lawsuits.
 * - Clicking "Details" routes the administrator to `/admin_view_single_case/:id`.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";

import { toast } from "react-toastify";
import { viewCount } from "../../Services/AdminService";

/**
 * AdminViewAllCases Component
 * ---------------------------
 * Displays the registry of all filed court cases in a table.
 */
function AdminViewAllCases() {
  // State storing the list of all filed court lawsuits
  const [data, setData] = useState([]);

  /**
   * fetchdata
   * ---------
   * Queries the backend API using `getAllCases` to retrieve all cases from MongoDB.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('getAllCases');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('Village Office View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };

  /**
   * Effect Hook: On Mount Data Loading
   * ----------------------------------
   * Fetches all cases when the page first loads.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Check if any case records exist */}
      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header fw-bold">Case Title</th>
                <th className="table-header fw-bold">Type</th>
                <th className="table-header fw-bold">Date Of Incident</th>
                <th className="table-header fw-bold">User Name</th>
                <th className="table-header fw-bold">Advocate Name</th>
                <th className="table-header fw-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((caseItem) => (
                  <tr key={caseItem._id}>
                    <td className="table-data">{caseItem.title}</td>
                    <td className="table-data">{caseItem.type}</td>
                    <td className="table-data">{caseItem.dateOfIncident.slice(0, 10)}</td>
                    <td className="table-data">{caseItem.userId?.name}</td>
                    <td className="table-data">
                      {caseItem.advocateStatus === true ? caseItem.advocateId?.name : '-'}
                    </td>
                    {/* View Complete Case Dossier Button */}
                    <td className="table-data">
                      <Link to={`/admin_view_single_case/${caseItem._id}`}>
                        <button className="btn btn-outline-secondary">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <h1>No Data obtained</h1>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="no-cases">
          <h1>No cases found</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewAllCases;
