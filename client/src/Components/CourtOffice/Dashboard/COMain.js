/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COMain.js
 * Path: client/src/Components/CourtOffice/Dashboard/COMain.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the Master Shell / Blueprint for the entire Court Office Portal.
 * Instead of reloading the whole screen for every page, it splits the screen into:
 * 1. A permanent left sidebar menu (`COSidebar`).
 * 2. A dynamic right content area that swaps components based on what the clerk clicked
 *    (e.g., viewing registered citizens, recruiting a new judge, or assigning judges to trials).
 * 
 * ROUTING & RENDERING FLOW:
 * - Rendered by `App.js` for all Court Office dashboard paths (`/co-dashboard`, `/co-add-judge`, etc.).
 * - Prop `data`: Passed from `App.js` to determine which operational view to render in the right panel.
 * - Views Swapped:
 *   - `"co-dashboard"` -> `CODashboard` (metric summary cards & quick stats).
 *   - `"add-judge"` -> `COAddJudge` (registration form to onboard new courtroom judges).
 *   - `"co-view-judges"` -> `COViewAlljudges` (table of active judges).
 *   - `"co-view-single-judge"` -> `COViewSIngleJudge` (individual judge credential record).
 *   - `"co_view_cases"` -> `COViewAllCases` (unassigned citizen case filings).
 *   - `"co-view-singleCase"` -> `COViewSinglecase` (case docket review & judge assignment).
 *   - `"co-viewallusers"` -> `COViewUsers` (roster of registered citizens).
 *   - `"co_view_AllAccepted_Cases"` -> `COViewAllCasesAccepted` (trials successfully assigned to judges).
 *   - `"co_view_AllAcceptedCases_Single"` -> `COViewAcceptedCaseSingle` (assigned trial detail view).
 * ==============================================================================
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../../Styles/AdminMain.css";

import CODashboard from "./CODashboard";
import COSidebar from "./COSidebar";
import COLogin from "../COLogin";
import COAddJudge from "./COAddJudge";
import COViewAlljudges from "./COViewAlljudges";
import COViewSIngleJudge from "./COViewSIngleJudge";
import COViewAllCases from "./COViewAllCases";
import COViewSinglecase from "./COViewSinglecase";
import COViewUsers from "./COViewUsers";
import COViewAllCasesAccepted from "./COViewAllCasesAccepted";
import COViewAcceptedCaseSingle from "./COViewAcceptedCaseSingle";

/**
 * COMain Component
 * Two-column layout container for court office administrative operations.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.data - Identifier string determining which sub-component to render
 */
function COMain({ data }) {
  const navigate = useNavigate(); 

  /**
   * Security Guard Effect:
   * Protects court office screens from unauthenticated visitors.
   */
  useEffect(() => {
    if (localStorage.getItem("court") == 0 || localStorage.getItem("court") == null) {
      navigate("/co-login");
    }
  }, [navigate]); 

  return (
    <div className="container-fluid admin_main">
      <div className="row">
        {/* Left Column: Persistent Navigation Sidebar */}
        <div
          className="col-lg-3 col-md-6 col-sm-12 adminmain-sidebar"
          style={{ padding: 0 }}
        >
          <COSidebar />
        </div>

        {/* Right Column: Dynamic Operational Workspace */}
        <div className="col-lg-9 col-md-6 col-sm-12 adminmain-content">
          {data === "co-dashboard" ? (
            <CODashboard />
          ) : data === "add-judge" ? (
            <COAddJudge />
          ) : data === "co-view-judges" ? (
            <COViewAlljudges />
          ) : data === "co-view-single-judge" ? (
            <COViewSIngleJudge />
          ) : data === "co_view_cases" ? (
            <COViewAllCases />
          ) : data === "co-view-singleCase" ? (
            <COViewSinglecase />
          ) : data === "co-viewallusers" ? (
            <COViewUsers />
          ) : data === "co_view_AllAccepted_Cases" ? (
            <COViewAllCasesAccepted />
          ) : data === "co_view_AllAcceptedCases_Single" ? (
            <COViewAcceptedCaseSingle />
          ) : (
            <COLogin />
          )}
        </div>
      </div>
    </div>
  );
}

export default COMain;