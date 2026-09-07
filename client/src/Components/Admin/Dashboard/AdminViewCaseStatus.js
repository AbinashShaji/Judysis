/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW CASE STATUS (AdminViewCaseStatus.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays the official courtroom progress timeline for a specific case.
 * The administrator can inspect:
 *   - Hearing / milestone update date
 *   - Current legal status (e.g., "Hearing Scheduled", "Evidence Under Review", "Adjourned")
 *   - Case progress description provided by the court office or presiding judge
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin_view_case_status/:id`
 *   (accessed by clicking the "Case Status" button in `AdminViewSingleCase.js`).
 * - Extracts case ID from the URL parameters (`useParams`).
 * - Renders a tabular history of all status changes logged throughout the case lifecycle.
 * ==============================================================================
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * AdminViewCaseStatus Component
 * -----------------------------
 * Displays the hearing progress milestones and judicial descriptions in a timeline table.
 */
function AdminViewCaseStatus() {
  // State storing the list of case status milestone entries
  const [data, setData] = useState([]);
  // Extract case ID from the URL parameters
  const { id } = useParams();

  // useEffect hook placeholder: Can call POST `/getStatusByCaseId/${id}` to fetch live timeline
  // useEffect(() => {
  //   axiosInstance
  //     .post(`/getStatusByCaseId/${id}`)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.data.status === 200) {
  //         setData(res.data.data || []);
  //       } else {
  //         setData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error!", error);
  //     });
  // }, [id]);

  return (
    <div className="adv_client_payment_status">
      <div className="container advocate_home_container2 pt-5 pb-5">
        {/* Render timeline table if updates exist */}
        {data.length > 0 ? (
          <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date.slice(0, 10)}</td>
                    <td>{payment.status}</td>
                    <td>{payment.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="no-payment-request">
            <h2>No Case Updates</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminViewCaseStatus;
