/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewAllCases.jsx
 * Path: client/src/Components/CourtOffice/Dashboard/COViewAllCases.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component displays all newly approved lawsuits that are ready for trial
 * but have NOT yet been assigned to a Courtroom Judge.
 * In these cases, a citizen has filed their lawsuit and an advocate has accepted
 * to represent them. Now, Court Registry staff must inspect each case and appoint
 * a qualified judge to preside over the proceedings.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co_view_cases` inside the `COMain` shell container.
 * - Accessible via "New Cases" in the Court Office sidebar.
 * - Data Journey:
 *   1. Calls `/getCaseAdvStatus` on mount to fetch cases awaiting judge assignment.
 *   2. Displays title, description, incident date, client name, and appointed advocate.
 *   3. Clicking "View More" takes the staff clerk to `/co-view-singleCase/:id` to select
 *      and assign a Judge.
 * ==============================================================================
 */

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

/**
 * COViewAllCases Component
 * Renders the table of unassigned legal cases awaiting judicial bench allocation.
 */
function COViewAllCases() {
  const navigate = useNavigate();

  // Security guard check
  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the list of unassigned cases
  const [data, setData] = useState([]);

  /**
   * redirect
   * Navigates to the case review & judge assignment screen.
   * 
   * @param {string} id - The case database ID
   */
  const redirect = async (id) => {
    navigate(`/co-view-singleCase/${id}`);
  };

  /**
   * fetchdata
   * Queries the database for lawsuits accepted by lawyers awaiting judicial assignment.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('getCaseAdvStatus');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('Court Office View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading new cases');
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
                  {/* Row index and case metadata */}
                  <td className="table-data">{index + 1}</td>
                  <td className="table-data">{advocate.title}</td>
                  <td className="table-data">{advocate.description}</td>
                  <td className="table-data">{advocate.type}</td>
                  <td className="table-data">{advocate.dateOfIncident?.slice(0, 10)}</td>
                  {/* Litigant & Legal Counsel names */}
                  <td className="table-data">{advocate.userId?.name}</td>
                  <td className="table-data">{advocate.advocateId?.name}</td>
                  
                  {/* Action button leading to Judge Assignment Screen */}
                  <td className="table-data">
                    <button
                      className="btn btn-outline-success button-size w-100"
                      onClick={() => redirect(advocate._id)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Fallback empty state when all active cases have been assigned judges */
        <div className="no_data_animation">
          <h1 className="text-center">No New Requests Found</h1>
        </div>
      )}
    </div>
  );
}

export default COViewAllCases;