/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewSIngleJudge.jsx
 * Path: client/src/Components/CourtOffice/Dashboard/COViewSIngleJudge.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component displays the full profile dossier of an individual courtroom Judge.
 * Court Office staff can review the Judge's contact info, specialization, and experience.
 * It also features an interactive "Edit Data" mode where clerks can update the Judge's
 * name, email, phone number, and courtroom experience, and save the changes directly.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-view-single-judge/:id` inside the `COMain` shell container.
 * - Data Journey:
 *   1. Reads the judge ID (`id`) from the URL parameters.
 *   2. Contacts `/viewJudgeById/:id` to retrieve current profile details.
 *   3. If "Edit Data" is clicked, inputs become editable text boxes.
 *   4. Submitting saves updates to `/editJudgeById/:id` via `resetPassword` service.
 *   5. On success: refreshes view with newly updated information.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../Styles/ViewProfile_AR.css";
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { resetPassword, ViewById } from "../../Services/CommonServices";

/**
 * COViewSingleJudge Component
 * Displays judge dossier with inline editing and updating features.
 */
function COViewSingleJudge({ view }) {
  // State storing the original fetched judge record
  const [advocate, setAdvocate] = useState(null);
  // State storing form values while editing
  const [data, setData] = useState({});
  // Toggle between read-only view and interactive edit form
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Security guard check
  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  /**
   * fetchdata
   * Retrieves the judge's full record from the database.
   */
  const fetchdata = async () => {
    try {
      const result = await ViewById("viewJudgeById", id);
      if (result.success) {
        if (result.user) {
          setAdvocate(result.user);
          setData(result.user); // Seed editable form with existing data
        } else {
          setAdvocate({});
        }
      } else {
        console.error("View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while loading judge details");
    }
  };

  useEffect(() => {
    fetchdata();
  }, [id]);

  /**
   * toggleEditMode
   * Switches the UI between read-only and editable text fields.
   */
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  /**
   * handleChange
   * Updates state as the clerk modifies fields during edit mode.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  /**
   * handleSave
   * Sends the updated profile information to the backend server.
   */
  const handleSave = async () => {
    try {
      console.log("Updated Data:", data);

      // Submit changes to backend
      const result = await resetPassword(data, "editJudgeById", id);

      if (result.success) {
        toast.success("Details updated successfully!");
        fetchdata(); // Refresh fresh data from server
        setIsEditing(false); // Return to read-only view mode
      } else {
        toast.error("Failed to update details");
      }
    } catch (error) {
      console.error("Error while updating:", error);
      toast.error("An error occurred while updating");
    }
  };

  // Render nothing until data is loaded
  if (!advocate) {
    return null;
  }

  return (
    <div className="container-fluid mt-4 ms-3">
      <div className="row justify-content-center mt-5">
        {/* Judge Name and Years on Bench */}
        <div className="admin_view_advocate_img text-center">
          <br />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={data.name || ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <label className="advocate-name d-block mt-3">{advocate.name}</label>
          )}
          <label className="experience-label d-block">
            {advocate.experience} Years of Experience
          </label>
          <br />
        </div>

        {/* Detailed Profile Table */}
        <div className="col-lg-8 col-md-6 col-sm-12">
          <div>
            <table className="table custom-table">
              <tbody>
                {/* Email Row */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">E-Mail</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={data.email || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <label className="sub-label">{advocate.email}</label>
                    )}
                  </td>
                </tr>

                {/* Phone Contact Row */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="text"
                        name="contact"
                        value={data.contact || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <label className="sub-label">{advocate.contact}</label>
                    )}
                  </td>
                </tr>

                {/* Specialization Area Row */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Area</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={data.specialization || ""}
                        onChange={handleChange}
                        className="form-control"
                        readOnly
                      />
                    ) : (
                      <label className="sub-label">{advocate.specialization}</label>
                    )}
                  </td>
                </tr>

                {/* Years of Experience Row */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="number"
                        name="experience"
                        value={data.experience || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <label className="sub-label">{advocate.experience} years</label>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Action Buttons: Edit / Save Toggle */}
            <div className="row mt-3">
              <center>
                {isEditing ? (
                  <button
                    type="button"
                    className="btn btn-secondary w-50 mt-3"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary w-50 mt-3"
                    onClick={toggleEditMode}
                  >
                    Edit Data
                  </button>
                )}
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default COViewSingleJudge;

