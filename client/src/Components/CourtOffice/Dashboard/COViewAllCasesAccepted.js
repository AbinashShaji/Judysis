/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewAllCasesAccepted.js
 * Path: client/src/Components/CourtOffice/Dashboard/COViewAllCasesAccepted.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component displays all active lawsuits that have ALREADY been assigned
 * to a presiding courtroom Judge.
 * In this list, both the defending lawyer and the presiding judge are locked in.
 * Court Office staff can review ongoing cases and click "View More" to inspect
 * the assigned judge, trial dossier, and court schedule.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co_view_AllAccepted_Cases` inside the `COMain` shell container.
 * - Accessible via "Accepted Cases" in the Court Office sidebar.
 * - Data Journey:
 *   1. Calls `/getCasesJudgeAssign` to retrieve all cases with judge assignments.
 *   2. Displays title, category, incident date, citizen name, and advocate name.
 *   3. Clicking "View More" links to `/co_view_AllAcceptedCases_Single/:id`.
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../Services/BaseURLMain';
import { Link, useNavigate } from 'react-router-dom';

/**
 * COViewAllCasesAccepted Component
 * Renders the roster of cases that have successfully received judicial appointment.
 */
function COViewAllCasesAccepted() {
  const navigate = useNavigate();

  // Security check: Ensure court staff is authenticated
  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the list of accepted / assigned cases
  const [data, setData] = useState([]);

  /**
   * Effect Hook: Load Assigned Lawsuits
   * Requests all cases where a judge has been assigned from the backend.
   */
  useEffect(() => {
    axiosInstance.post(`/getCasesJudgeAssign`)
      .then((result) => {
        console.log(result);
        setData(result.data.data || []);
      })
      .catch((error) => {
        console.error("Error loading assigned cases:", error);
      });
  }, []);

  return (
    <div className="main-div">
      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead className="admin-tab-head">
              <tr>
                <th className="table-header admin-tab-head-text">SlNo</th>
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
              {data.map((advocate, index) => (
                <tr key={advocate._id}>
                  {/* Case Index & Particulars */}
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">{advocate.title}</td>
                  <td className="table-data">{advocate.description}</td>
                  <td className="table-data">{advocate.type}</td>
                  <td className="table-data">{advocate.dateOfIncident?.slice(0, 10)}</td>
                  {/* Parties & Counsel */}
                  <td className="table-data">{advocate.userId?.name}</td>
                  <td className="table-data">{advocate.advocateId?.name}</td> 
                  
                  {/* Action: Inspect assigned trial file */}
                  <td className="table-data">
                    <Link to={`/co_view_AllAcceptedCases_Single/${advocate._id}`}>
                      <button className="btn btn-outline-success button-size w-100">
                        View More
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state when no assigned trials exist */
        <div className="no_data_animation">
          <h1 className="text-center">No New Requests Found</h1>
        </div>
      )}
    </div>
  );
}

export default COViewAllCasesAccepted;