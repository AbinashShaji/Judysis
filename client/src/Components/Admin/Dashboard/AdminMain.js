/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR MAIN LAYOUT CONTROLLER (AdminMain.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the master layout shell for the entire Administrator portal.
 * It keeps the navigation sidebar (`AdminSidebar`) fixed on the left-hand side
 * while dynamically swapping different control screens into the main content
 * area on the right based on the `data` property passed down from the router.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by admin route declarations in `App.js`:
 *     - `/admin-dashboard`                -> `<AdminMain data="admindashboard" />`
 *     - `/admin-view-all-advocates`       -> `<AdminMain data="adminviewalladvocates" />`
 *     - `/admin-adv-reqs`                 -> `<AdminMain data="admin-adv-reqs" />`
 *     - `/admin-view-all-users`           -> `<AdminMain data="adminviewallusers" />`
 *     - `/admin-view-single-user/:id`     -> `<AdminMain data="admin-view-single-user" />`
 *     - `/admin_view_cases`               -> `<AdminMain data="admin_view_cases" />`
 *     - `/admin_view_judges`              -> `<AdminMain data="admin_view_judges" />`
 *     - `/admin_view_feedbacks`           -> `<AdminMain data="admin_view_feedbacks" />`
 *     - `/admin-userreqs`                 -> `<AdminMain data="admin-userreqs" />`
 *     - `/admin-view-single-case/:id`     -> `<AdminMain data="viewSingleCase" />`
 * - Route Protection:
 *     Checks `localStorage.getItem("admin")`. If the admin is not logged in (flag = 0),
 *     it immediately navigates to `/admin-login`.
 * ==============================================================================
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "../Login/AdminLogin";
import ViewAllAdvocates from "./ViewAllAdvocates";
import ApproveRejectAdvocate from "./AdminViewAdvReqs";
import ViewProfile_AR from "./ViewProfile_AR";
import "../../../Styles/AdminMain.css";

import AdminViewComplaints from "./AdminViewComplaints";
import AdminViewUsers from "./AdminViewUsers";
import AdminViewSingleUsers from "./AdminViewSingleUsers";
import AdminViewAllCases from "./AdminViewAllCases";
import AdminViewSingleCase from "./AdminViewSingleCase";
import AdminViewCaseStatus from "./AdminViewCaseStatus";
import AdminViewEvidences from "./AdminViewEvidences";
import AdminViewPayment from "./AdminViewPayment";
import AdminViewUserReqs from "./AdminViewUserReqs";
import AdminViewAdvReqs from "./AdminViewAdvReqs";
import AdminViewFeedbacks from "./AdminViewFeedbacks";
import AdminViewJudjes from "./AdminViewJudjes";

/**
 * AdminMain Component
 * -------------------
 * Acts as the master container that renders the left sidebar and switches the
 * right-hand content screen according to the `data` prop.
 * 
 * @param {Object} props
 * @param {string} props.data - Screen key identifying which page component to display.
 */
function AdminMain({ data }) {
  const navigate = useNavigate(); 

  /**
   * Effect Hook: Route Guard
   * ------------------------
   * If the administrator session flag is 0 or absent, redirect immediately to login.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == 0) {
      navigate("/admin-login");
    }
  }, [navigate]); 

  return (
    <div className="container-fluid admin_main">
      <div className="row">
        {/* LEFT COLUMN: Persistent Administrator Sidebar Navigation */}
        <div
          className="col-lg-3 col-md-6 col-sm-12 adminmain-sidebar"
          style={{ padding: 0 }}
        >
          <AdminSidebar />
        </div>

        {/* RIGHT COLUMN: Dynamic Page Content Area */}
        <div className=" col-lg-9 col-md-6 col-sm-12 adminmain-content">
          {/* Switch screens based on the data prop */}
          {data === "admindashboard" ? (
            <AdminDashboard />
          ) : data === "admin-adv-reqs" ? (
            <AdminViewAdvReqs />
          ) : data === "adminviewrequest" ? (
            <ViewProfile_AR view="request" />
          ) : data === "adminviewrequest" ? (
            <ViewProfile_AR view="view" />
          ) : data === "adminviewalladvocates" ? (
            <ViewAllAdvocates />
          ) : data === "viewSingleCase" ? (
            <AdminViewSingleCase />
          ) : data === "complaints" ? (
            <AdminViewComplaints />
          ) : data === "adminviewallusers" ? (
            <AdminViewUsers />
          ) : data === "admin-view-single-user" ? (
            <AdminViewSingleUsers />
          ) : data === "admin_view_cases" ? (
            <AdminViewAllCases />
          ) : data === "viewSingleCase" ? (
            <AdminViewSingleCase />
          ) : data === "status" ? (
            <AdminViewCaseStatus />
          ) : data === "evidence" ? (
            <AdminViewEvidences />
          ) : data === "admin_view_feedbacks" ? (
            <AdminViewFeedbacks />
          ) : data === "admin-userreqs" ? (
            <AdminViewUserReqs />
          ) : data === "admin_view_judges" ? (
            <AdminViewJudjes />
          ) : (
            // Default fallback if no matched key
            <AdminLogin />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMain;