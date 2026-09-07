/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR TOP NAVIGATION BAR (AdminNav.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the header navigation bar displayed across all administrator screens.
 * It renders the JudiSys court management logo and branding, and performs an
 * authentication check to make sure uninvited guests cannot access the admin area.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Mounted at the very top of administrator pages (inside `AdminMain.js`).
 * - Automatically checks `localStorage` when loaded:
 *     If the admin is not logged in, it immediately redirects them to `/admin-login`.
 * - Provides a `logout` function to clear administrative session tokens and return
 *   to the public landing page (`/`).
 * ==============================================================================
 */

import React, { useEffect } from "react";
import img1 from "../../../Assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";

/**
 * AdminNav Component
 * ------------------
 * Renders the top navigation bar with system logo and protects administrative screens.
 */
function AdminNav() {
  const navigate = useNavigate();

  /**
   * logout
   * ------
   * Clears all session keys stored in the browser (logging out the admin)
   * and navigates back to the public homepage.
   */
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  /**
   * Effect Hook: Route Guard Check
   * ------------------------------
   * Checks whether the admin is authenticated. If the admin key is missing or set to 0,
   * it kicks the user back to the admin login page.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == 0) {
      navigate("/admin-login");
    }
  }, [navigate]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar nav">
        <div className="container-fluid">
          {/* JudiSys Application Brand Logo and Name */}
          {/* <Link className="navbar-brand" to="#home"> */}
            <img
              alt="Logo"
              src={img1}
              width="70"
              height="75"
              className="d-inline-block align-top logo-adjust"
            />{" "}
            JudiSys
          {/* </Link> */}
          
          {/* Mobile screen hamburger toggle button */}
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
        </div>
      </nav>
    </div>
  );
}

export default AdminNav;