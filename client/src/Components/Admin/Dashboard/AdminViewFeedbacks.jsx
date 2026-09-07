/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW USER FEEDBACKS (AdminViewFeedbacks.jsx)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen lets the administrator read through feedback, reviews, and testimonials
 * submitted by citizens using the JudiSys judicial platform.
 * The administrator can inspect:
 *   - Serial number
 *   - Citizen (Petitioner) Name
 *   - Feedback message text
 *   - Submission date
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin_view_feedbacks`
 *   (accessed via the "Feedback" link in `AdminSidebar.js`).
 * - Calls `viewCount('viewAllfeedbacks')` on component mount (`useEffect`) to load
 *   all citizen reviews from MongoDB.
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
 * AdminViewFeedbacks Component
 * ----------------------------
 * Renders the table of citizen reviews and feedback submissions.
 */
function AdminViewFeedbacks() {
  // State storing the list of submitted feedbacks
  const [data, setData] = useState([]);

  /**
   * fetchdata
   * ---------
   * Queries the backend using `viewAllfeedbacks` to retrieve all feedback records.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAllfeedbacks');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('View Error :', result);
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
   * Fetches citizen feedback as soon as the screen opens.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Check if any feedback entries exist */}
      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header fw-bold">Sl No</th>
                <th className="table-header fw-bold">User Name</th>
                <th className="table-header fw-bold">Feedback</th>
                <th className="table-header fw-bold">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((feedbackItem, index) => (
                  <tr key={feedbackItem._id || index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{feedbackItem.userId?.name}</td>
                    <td className="table-data">{feedbackItem.feedback}</td>
                    <td className="table-data">{feedbackItem.date?.slice(0, 10)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
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
          <h1>No feedbacks</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewFeedbacks;
