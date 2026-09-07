/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR FOOTER (AdminFooter.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the standard bottom footer displayed across administrative pages.
 * It renders the JudiSys logo, copyright notices, and maintains visual consistency
 * with the dark-themed administration interface.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Mounted at the bottom of administrative views (inside `AdminMain.js`).
 * - Contains a guard check in `useEffect` to ensure only logged-in administrators
 *   can see the page; redirects unauthorized visitors to the homepage (`/`).
 * ==============================================================================
 */

import React, { useEffect } from 'react';
import './AdminFooter.css';
import logo from '../../../Assets/logo2.png';
import { useNavigate } from 'react-router-dom';

/**
 * AdminFooter Component
 * --------------------
 * Renders copyright info and brand marks at the bottom of the administrator dashboard.
 */
function AdminFooter() {
  const navigate = useNavigate();

  /**
   * Effect Hook: Authentication Verification
   * ----------------------------------------
   * Verifies that the administrator is authenticated. If not, redirects to the homepage.
   */
  useEffect(() => {
    if (localStorage.getItem("adminId" == null)) {
      navigate("/");
    }
  });

  return (
    <div className="admin-footer bg-dark text-white">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Brand Logo & Application Title */}
          <div className="col-4 col-md-6 d-flex align-items-center">
            <img
              className="footer-img"
              src={logo}
              alt="Admin Footer Logo"
              width="70"
              height="90"
            />
            <span className="footer-logo-text-change ml-2">JudiSys</span>
          </div>

          {/* Copyright Notice */}
          <div className="col-8 col-md-6 text-md-left mt-3 mt-md-0">
            <span className="footer-text">
              © Copyright | All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminFooter;