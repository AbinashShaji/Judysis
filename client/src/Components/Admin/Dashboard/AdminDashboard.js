/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR DASHBOARD METRICS (AdminDashboard.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the administrator's homepage / control center dashboard.
 * It displays real-time high-level statistics cards showing:
 *   1. Total Registered Users (citizens using the system)
 *   2. Total Court Cases filed
 *   3. Total Registered Advocates (approved lawyers)
 *   4. Total User Feedback and reviews submitted
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin-dashboard`.
 * - On component mount (`useEffect`), four separate asynchronous API queries are made
 *   via `viewCount` (from `AdminService.js`):
 *     1. `viewAdvocates`   -> Counts active lawyers.
 *     2. `viewAllUsers`    -> Counts registered citizen accounts.
 *     3. `getAllCases`     -> Counts all filed court cases.
 *     4. `getAllFeedbacks` -> Counts user feedback entries.
 * - Whenever a user registers, a case is filed, or a lawyer is approved, these metric
 *   counters automatically reflect the updated totals.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../../Styles/AdminDashboard.css";
import userimg from "../../../Assets/Vector (1).png";
import casesimg from "../../../Assets/Vector (2).png";
import adimg from "../../../Assets/image 19.png";
import complaintimg from "../../../Assets/codiconbriefcase.png";

import { viewCount } from "../../Services/AdminService";
import { toast } from "react-toastify";

/**
 * AdminDashboard Component
 * ------------------------
 * Displays aggregate count boxes for users, cases, advocates, and feedback.
 */
function AdminDashboard() {
  // State variables storing retrieved arrays to compute metric counts
  const [userCount, setUserCount] = useState(0);
  const [advocateCount, setAdvocateCount] = useState(0);
  const [cases, setCases] = useState(0);
  const [complaints, setComplaints] = useState(0);
  const [feeds, setFeeds] = useState(0);

  /**
   * fetchdata
   * ---------
   * Calls the backend to fetch all registered advocates and counts them.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAdvocates');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setAdvocateCount(result.user);
        else
          setAdvocateCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
    }
  };

  /**
   * fetchuserdata
   * -------------
   * Calls the backend to fetch all registered citizen users and counts them.
   */
  const fetchuserdata = async () => {
    try {
      const result = await viewCount('viewAllUsers');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setUserCount(result.user);
        else
          setAdvocateCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
    }
  };

  /**
   * fetchCasedata
   * -------------
   * Calls the backend to fetch all legal court cases and counts them.
   */
  const fetchCasedata = async () => {
    try {
      const result = await viewCount('getAllCases');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setCases(result.user);
        else
          setAdvocateCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
    }
  };

  /**
   * fetchFeedback
   * -------------
   * Calls the backend to fetch all citizen feedback submissions and counts them.
   */
  const fetchFeedback = async () => {
    try {
      const result = await viewCount('getAllFeedbacks');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setFeeds(result.user);
        else
          setAdvocateCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
    }
  };

  /**
   * Effect Hook: On Mount Data Loading
   * ----------------------------------
   * Runs once when the administrator opens the dashboard. Fetches metrics for all 4 categories.
   */
  useEffect(() => {
    fetchdata();
    fetchuserdata();
    fetchCasedata();
    fetchFeedback();
  }, []);

  return (
    <div className="container">
      {/* Grid row holding the 4 key statistical metric cards */}
      <div className="row dashboard-adjust mt-5">
        {/* CARD 1: Total Registered Citizens */}
        <div className="col-12 col-sm-6 col-md-3 mb-4 adjust-box">
          <div className="dashbord-box">
            <img className="image-adjust" src={userimg} alt="User icon" />
            <div className="text-container">
              <label className="count-label">{userCount.length}</label>
              <label className="content-label">Users</label>
            </div>
          </div>
        </div>

        {/* CARD 2: Total Filed Court Cases */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="dashbord-box">
            <img className="image-adjust" src={casesimg} alt="Cases icon" />
            <div className="text-container">
              <label className="count-label">{cases.length}</label>
              <label className="content-label">Cases</label>
            </div>
          </div>
        </div>

        {/* CARD 3: Total Approved Advocates */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="dashbord-box">
            <img className="image-adjust" src={adimg} alt="Advocate icon" />
            <div className="text-container">
              <label className="count-label">{advocateCount.length}</label>
              <label className="content-label">Advocates</label>
            </div>
          </div>
        </div>

        {/* CARD 4: Total Citizen Feedback */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="dashbord-box">
            <img className="image-adjust" src={complaintimg} alt="Feedback icon" />
            <div className="text-container">
              <label className="count-label">{feeds.length}</label>
              <label className="content-label">Feedback</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;