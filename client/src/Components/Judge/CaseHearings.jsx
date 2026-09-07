/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: CaseHearings.jsx
 * Path: client/src/Components/Judge/CaseHearings.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the official Courtroom Hearing Record & Verdict Manager for Judges.
 * It lets a Judge:
 * 1. Review all past courtroom hearings, dates, and judge remarks for a case.
 * 2. Schedule the next hearing date if the trial needs to continue.
 * 3. Put a case "On Hold" or officially mark it "Closed" when a final verdict is delivered.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/case-hearings/:id` (where `:id` is the unique Case ID).
 * - Impact on Other Portals:
 *   - Any hearing added here instantly updates the public timeline seen by Litigants
 *     (`/user_view_hearing_details/:id`) and Defense Advocates (`/adv-case-hearings/:id`).
 *   - When the Judge sets the status to "Closed", the case automatically transitions
 *     into the `/judge-view-closed-cases` archive, and future hearing additions are disabled.
 * - Data Journey:
 *   1. Reads case ID from URL parameters.
 *   2. Fetches past proceedings via `/getStatusByCaseId/:id`.
 *   3. Submits new hearing decisions or verdicts via `/createStatus`.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { register, ViewById } from "../Services/CommonServices";
import "../../Styles/UserAddCases.css";

/**
 * CaseHearings Component
 * Renders the trial hearing ledger and provides the judicial status updating form.
 */
function CaseHearings() {
  const { id } = useParams();

  // State storing the list of previous hearings for this case
  const [hearings, setHearings] = useState([]);
  
  // State storing the new hearing form inputs being entered by the Judge
  const [newHearing, setNewHearing] = useState({
    hearingDate: "",
    status: "",
    description: "",
    caseId: id,
  });

  // Tracks the current active status of the case ("Closed", "Scheduled Next Hearing", etc.)
  const [currentStatus, setCurrentStatus] = useState("");
  // State storing validation error messages
  const [errors, setErrors] = useState({});

  /**
   * fetchHearings
   * Contacts the database to retrieve all historical proceedings for this case.
   */
  const fetchHearings = async () => {
    try {
      const result = await ViewById("getStatusByCaseId", id);
      if (result.success) {
        setHearings(result.user || []);
        // Determine the most recent case status to decide if new hearings can be scheduled
        if (result.user.length > 0) {
          setCurrentStatus(result.user[0].status); // Latest hearing appears first
        } else {
          setCurrentStatus(""); // Reset if no hearings have taken place yet
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching hearings:", error);
      toast.error("Failed to load hearings");
    }
  };

  /**
   * Initial Load Effect:
   * Triggers fetching the case history whenever the case ID changes.
   */
  useEffect(() => {
    fetchHearings();
  }, [id]);

  /**
   * handleInputChange
   * Updates state as the Judge selects status dropdowns or types descriptions.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHearing({ ...newHearing, [name]: value });
  };

  /**
   * handleAddHearing
   * Validates the Judge's input and persists the new hearing or verdict to the database.
   * 
   * @param {Event} e - Form submission event
   */
  const handleAddHearing = async (e) => {
    e.preventDefault();
    
    // Step 1: Validate required fields
    const newErrors = {};
    if (!newHearing.status) newErrors.status = "Status is required.";
    // If the Judge chooses to continue the trial, a future date is mandatory
    if (newHearing.status === "Scheduled Next Hearing" && !newHearing.hearingDate)
      newErrors.hearingDate = "Next hearing date is required.";
    if (!newHearing.description) newErrors.description = "Description is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Step 2: Post the hearing record to the backend
    try {
      const result = await register(newHearing, "createStatus");
      if (result.success) {
        toast.success("Hearing added successfully!");
        // Refresh the table to immediately reflect the new hearing on screen
        fetchHearings();
        // Reset the form input fields
        setNewHearing({ hearingDate: "", status: "", description: "", caseId: id });
        setErrors({});
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding hearing:", error);
      toast.error("Failed to add hearing");
    }
  };

  return (
    <div className="container">
      <div className="case-hearings container mt-5">
        <center>
          <h2>Case Hearings</h2>
        </center>
        
        {/* Previous Hearings Ledger */}
        <h4 className="mt-3">Previous Hearings</h4>

        <div className="advocate_home_container2_table table-responsive">
          {hearings.length > 0 ? (
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
                    {/* Date this status was recorded */}
                    <td>{caseReq?.date ? caseReq.date.slice(0, 10) : "N/A"}</td>
                    {/* Status badge: Closed, On Hold, etc. */}
                    <td>{caseReq?.status ? caseReq.status.slice(0, 10) : "N/A"}</td>
                    {/* Scheduled continuation date */}
                    <td>{caseReq?.hearingDate ? caseReq.hearingDate.slice(0, 10) : "N/A"}</td>
                    {/* Courtroom proceedings summary */}
                    <td title={caseReq?.description}>
                      {caseReq?.description?.slice(0, 50)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hearings available for this case.</p>
          )}
        </div>

        {/* Add Hearing / Verdict Form (Hidden if the case is already marked Closed) */}
        {currentStatus !== "Closed" && (
          <div className="add_cases_status mt-3 mb-3">
            <h4>Add New Hearing</h4>
            <form onSubmit={handleAddHearing}>
              <div className="row">
                {/* Status Dropdown */}
                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Status</label>
                  </div>
                  <select
                    className="form-select form-control-lg specialization-form-select mb-2"
                    name="status"
                    onChange={handleInputChange}
                    value={newHearing.status}
                    required
                  >
                    <option value="">Choose an option</option>
                    <option value="Closed">Closed</option>
                    <option value="Scheduled Next Hearing">Scheduled Next Hearing</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  {errors.status && <div className="text-danger">{errors.status}</div>}
                </div>

                {/* Next Hearing Date Picker (Only shown when continuation is chosen) */}
                {newHearing.status === "Scheduled Next Hearing" && (
                  <div className="col-6">
                    <div className="user_add_cases_title">
                      <label>Next Hearing Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control border border-dark"
                      name="hearingDate"
                      min={new Date().toISOString().split("T")[0]} // Restrict past dates
                      onChange={handleInputChange}
                      required
                    />
                    {errors.hearingDate && (
                      <span className="text-danger">{errors.hearingDate}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Judicial Findings / Remarks Input */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  placeholder="Enter hearing outcome or judge remarks"
                  value={newHearing.description}
                  onChange={handleInputChange}
                  required
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn bg-gold">
                  Add Case Status
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseHearings;

