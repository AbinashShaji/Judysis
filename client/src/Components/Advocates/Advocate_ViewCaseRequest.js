/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: Advocate_ViewCaseRequest.js
 * Path: client/src/Components/Advocates/Advocate_ViewCaseRequest.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen displays a table of pending legal representation requests.
 * When citizens file a case and choose this advocate to represent them,
 * the case appears in this list. The lawyer can inspect the basic incident details
 * and click "View Details" to accept or decline taking the case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/advocate_viewcasereq`
 * - Rendering Impact: Accessible from the Advocate navigation bar ("Case Requests").
 * - Data Journey:
 *   1. Reads advocate ID (`id`) from `localStorage.getItem('advocate')`.
 *   2. Queries `/getAppointmentReqsForAdv/:id` to retrieve pending requests.
 *   3. If requests exist, renders a table showing client name, case type, and opponent info.
 *   4. Clicking "View Details" links to `/advocate_view_single_case_req/:id` for accept/reject actions.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../../Styles/Advocate_ViewCaseRequest.css';
import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react"; 
import { ViewById } from "../Services/CommonServices";
import { toast } from "react-toastify";

/**
 * Advocate_ViewCaseRequest Component
 * Displays a list of all pending representation requests submitted by litigants.
 */
function Advocate_ViewCaseRequest() {
  // Local state storing the list of case requests from the database
  const [data, setData] = useState([]);
  // Get the logged-in lawyer's ID from browser storage
  const id = localStorage.getItem('advocate');

  /**
   * Effect Hook: Load Pending Case Requests
   * Queries the database for pending appointment requests linked to this advocate.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);
        
        // Fetch appointment requests awaiting advocate response
        const result = await ViewById('getAppointmentReqsForAdv', id);

        if (result.success) {
          console.log(result);
          setData(result.user || []);
        } else {
          console.error('Advocate View Error :', result);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred while loading case requests');
      }
    };
    fetchdata();
  }, [id]);

  console.log(data); 

  return (
    <div>
      {/* Page Title Header */}
      <div className="junior-heading-div container-fluid">
        <label className="main-title">Case Request</label>
      </div>

      <div className="main-div">
        {/* Check if there are any case requests to show */}
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
                {data.map((caseReq) => (
                  <tr key={caseReq._id}>
                    {/* Case Title */}
                    <td className="table-data">
                      {caseReq.caseId?.title || "N/A"}
                    </td>
                    {/* Client Name */}
                    <td className="table-data">
                      {caseReq.userId?.name || "N/A"}
                    </td>
                    {/* Client Phone Number */}
                    <td className="table-data">
                      {caseReq.userId?.contact || "N/A"}
                    </td>
                    {/* Legal Category / Type */}
                    <td className="table-data">
                      {caseReq.caseId?.type || "N/A"}
                    </td>
                    {/* Incident Date */}
                    <td className="table-data">
                      {caseReq.caseId?.dateOfIncident
                        ? caseReq.caseId.dateOfIncident.slice(0, 10)
                        : "N/A"}
                    </td>
                    {/* Opponent / Defendant Name */}
                    <td className="table-data">
                      {caseReq.caseId?.opponentName || "Unknown"}
                    </td>
                    {/* Opponent Address / Information */}
                    <td className="table-data">
                      {caseReq.caseId?.opponentAddress || "Unknown"}
                    </td>
                    {/* Case Jurisdiction / Location */}
                    <td className="table-data">
                      {caseReq.caseId?.location || "N/A"}
                    </td>

                    {/* Action Button: Opens the review dossier to accept or decline */}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state when no pending requests exist */
          <div className="no-cases">
            <h1 className="text-center">No Recent Cases</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Advocate_ViewCaseRequest;

