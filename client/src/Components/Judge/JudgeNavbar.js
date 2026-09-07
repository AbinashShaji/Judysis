/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeNavbar.js
 * Path: client/src/Components/Judge/JudgeNavbar.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the top menu bar shown across all Judge Portal screens.
 * It provides quick navigation links for judges to return to their dashboard,
 * inspect active courtroom trials or closed verdicts, and securely log out.
 * 
 * ROUTING & RENDERING FLOW:
 * - Rendered: Automatically at the top of every judge page (`/judge-home`, `/judge-view-cases`, etc.).
 * - Security Guard: Checks `localStorage.getItem('judge')`. If null, redirects to `/`.
 * - Navigation Links:
 *   - "Home" -> Takes the judge to `/judge-home`.
 *   - "Current cases" -> Takes the judge to `/judge-view-cases`.
 *   - "Closed Cases" -> Takes the judge to `/judge-view-closed-cases`.
 *   - "Logout" -> Deletes `judge` from localStorage and returns to `/judge-login`.
 * ==============================================================================
 */

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../../Assets/logo2.png";
import { toast } from "react-toastify";

/**
 * JudgeNavbar Component
 * Renders the responsive top navigation bar for judges.
 */
function JudgeNavbar() {
  const navigate = useNavigate();
  const id = localStorage.getItem("judge");

  /**
   * Security Check Effect:
   * Confirms a valid judge session exists. If the judge has logged out or cleared storage,
   * immediately bounces them to the landing page.
   */
  useEffect(() => {
    if (localStorage.getItem("judge") == null) {
      navigate("/");
    }
  }, [navigate]);

  /**
   * handleLogout
   * Destroys the judge's active browser session and redirects to the judge sign-in page.
   */
  const handleLogout = () => {
    // Erase the stored judge token/id
    localStorage.removeItem("judge");
    toast.success("Logged out successfully.");
    setTimeout(() => {
      navigate("/judge-login");
    }, 500);
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar"
        style={{ minHeight: "10vh" }}
      >
        <div className="container">
          {/* Brand Logo and Title */}
          <div className="navbar-brand d-flex align-items-center">
            <img
              alt="Logo"
              src={img1}
              width="50"
              height="50"
              className="d-inline-block align-top me-2"
            />
            <span>JudiSys</span>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Dashboard Home Link */}
              <li className="nav-item">
                <Link className="nav-link" to="/judge-home">
                  Home
                </Link>
              </li>

              {/* Cases Dropdown Menu */}
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Cases
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {/* View Active Trials */}
                  <Link to="/judge-view-cases" className="dropdown-item">
                    Current cases
                  </Link>
                  {/* View Completed & Settled Cases */}
                  <Link to="/judge-view-closed-cases" className="dropdown-item">
                    Closed Cases
                  </Link>
                </div>
              </li>

              {/* Secure Session Sign Out */}
              <li className="nav-item">
                <Link className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default JudgeNavbar;

