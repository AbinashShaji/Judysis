/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW ADVOCATE PROFILE (ViewProfile_AllAdvocate.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays the complete professional profile of an approved advocate (lawyer)
 * from the main lawyers directory.
 * The administrator can inspect:
 *   1. Official portrait and name.
 *   2. Scanned Bar Council ID card preview image.
 *   3. Enrolment number, phone number, email, and specialization.
 *   4. Years of courtroom experience.
 *   5. Age dynamically calculated from their date of birth.
 *   6. Toggle buttons to Activate or Deactivate the lawyer's account access.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin_view_single_advocate/:id`
 *   (accessed by clicking the view icon in `ViewAllAdvocates.js`).
 * - Extracts advocate ID from the URL parameters (`useParams`).
 * - Calls POST `/viewAdvocateById/:id` to retrieve the lawyer's database document.
 * - Clicking "Activate" or "Deactivate" updates the account status in MongoDB and
 *   immediately refreshes the button state.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../Services/BaseURLMain";
// import axiosInstance from '../../Services/BaseURL';
// import '../Admin/ViewProfile_AR.css';
import { IMG_BASE_URL } from "../../Services/BaseURL";

/**
 * ViewProfile_AllAdvocate Component
 * ---------------------------------
 * Renders the approved lawyer's profile, ID proof document, and account toggle button.
 */
function ViewProfile_AllAdvocate() {
  // State storing the advocate's detailed profile record
  const [advocate, setAdvocate] = useState(null);
  // Read advocate ID from the browser URL (/admin_view_single_advocate/:id)
  const { id } = useParams();
  const url = axiosInstance.defaults.url;

  /**
   * Effect Hook: Load Advocate Details
   * ----------------------------------
   * Fetches the complete advocate profile from POST `/viewAdvocateById/:id`.
   */
  useEffect(() => {
    axiosInstance
      .post(`/viewAdvocateById/${id}`)
      .then((response) => {
        console.log(response);
        setAdvocate(response.data.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the advocate details!",
          error
        );
      });
  }, [id]);

  /**
   * handleActivate
   * --------------
   * Calls POST `/activateAdvocateById/:id` to unlock an advocate's account.
   * 
   * @param {string} id - Advocate MongoDB ID
   */
  const handleActivate = (id) => {
    axiosInstance.post(`/activateAdvocateById/${id}`)
      .then(res => {
        if (res.data.status === 200) {
          setAdvocate(prevState => ({ ...prevState, isActive: true }));
        }
      })
      .catch(error => {
        console.error("Error!", error);
      });
  };

  /**
   * handleDeactivate
   * ----------------
   * Calls POST `/deactivateAdvocateById/:id` to suspend an advocate's account.
   * 
   * @param {string} id - Advocate MongoDB ID
   */
  const handleDeactivate = (id) => {
    axiosInstance.post(`/deactivateAdvocateById/${id}`)
      .then(res => {
        if (res.data.status === 200) {
          setAdvocate(prevState => ({ ...prevState, isActive: false }));
        }
      })
      .catch(error => {
        console.error("Error!", error);
      });
  };

  /**
   * calculateAge
   * ------------
   * Helper function that calculates an advocate's exact current age in years
   * using their birth date.
   * 
   * @param {string} dob - ISO birth date string
   * @returns {number|string} Age in years, or "N/A" if birth date is missing
   */
  const calculateAge = (dob) => {
    if (!dob) return "N/A"; 
    const birthDate = new Date(dob); 
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // If advocate data has not finished loading from the backend, show blank
  if (!advocate) {
    return '';
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        {/* LEFT COLUMN: Headshot, Specialization, and Scanned ID Proof Image */}
        <div className="col-4 text-center">
          <img
            src={`${IMG_BASE_URL}/${advocate?.profilePic.filename}`}
            className="img-fluid rounded"
            alt="Advocate"
          />

          <label className="advocate-name d-block mt-3">{advocate?.name}</label>
          <label className="practice-area d-block">Practice Area</label>
          <label className="experience-label d-block">
            {advocate?.experience} Years of Experience in Various Cases
          </label>
          <br />
          
          {/* Display Scanned Bar Council ID Proof Document */}
          <p>Id Proof : </p>
          <img
            src={`${IMG_BASE_URL}/${advocate?.idProof?.filename}`}
            width="400px"
            height="200px"
            style={{ objectFit: "contain" }}
            alt="ID Proof"
          />
        </div>

        {/* RIGHT COLUMN: Tabular Credential Information */}
        <div className="col-4 mt-5">
          <div>
            <table className="table custom-table">
              <tbody>
                {/* Bar Council Number */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">
                      Bar Council Enrollment Number
                    </label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.bcNo}</label>
                  </td>
                </tr>

                {/* Contact Phone */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.contact}</label>
                  </td>
                </tr>

                {/* Email Address */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Email Id</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.email}</label>
                  </td>
                </tr>

                {/* Legal Specialization */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Areas</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {advocate?.specialization}
                    </label>
                  </td>
                </tr>

                {/* Years of Practice */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.experience}</label>
                  </td>
                </tr>

                {/* Calculated Age */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Age</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {calculateAge(advocate?.dob)}
                    </label>
                  </td>
                </tr>

                {/* Professional Experience */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Professional Experience</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {advocate?.experience} years
                    </label>
                  </td>
                </tr>

                {/* Account Status Toggle: Deactivate or Activate */}
                {advocate.isActive ? (
                  <button
                    className="btn btn-outline-danger button-size1"
                    onClick={() => handleDeactivate(advocate._id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-success button-size1"
                    onClick={() => handleActivate(advocate._id)}
                  >
                    Activate
                  </button>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile_AllAdvocate;
