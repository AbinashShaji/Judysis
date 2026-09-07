/**
 * ============================================================================
 * COMPONENT: LandingNavbar.js (Public Top Navigation Bar)
 * HANDOVER SUMMARY:
 * This component is the top header bar seen by visitors when they first visit JudiSys.
 * It contains the JudiSys logo, links to public pages (Home, About Us, Services),
 * and dropdown menus directing users to their specific login (Petitioner, Attorney,
 * Judge, Court Office, Admin) or registration portals.
 * ============================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/LandingNavbar.css';
import img1 from '../../Assets/logo2.png'; 

function LandingNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar landing_custom_-right">
      <div className="container-fluid ">
        {/* Brand Logo and Platform Title */}
        <img
          alt="Logo"
          src={img1}
          width="70"
          height="80"
          className="d-inline-block align-top"
        />{' '}
        JudiSys

        {/* Mobile Toggle Button for responsive collapse on phones/tablets */}
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

        {/* Navigation Links and Dropdowns */}
        <div className="collapse navbar-collapse flex-grow-0 mt-3 landingnavbar_text" >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0" >
            {/* Home Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {/* About Us Information Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus">About Us</Link>
            </li>

            {/* Platform Services Link */}
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
     
            {/* LOGIN DROPDOWN: Categorized by Role */}
            <li className="nav-item dropdown">
              <Link
                to="#"
                className="nav-link dropdown-toggle"
                id="loginDropdown"
                role="button"
                data-bs-toggle="dropdown"  
                aria-expanded="false"
              >
                Login
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
                {/* 1. Admin Login */}
                <li>
                  <Link to="/admin-login" className="dropdown-item">
                    Admin
                  </Link>
                </li>
                {/* 2. Citizen / Petitioner Login */}
                <li>
                  <Link to="/user-login" className="dropdown-item">
                    Petitioner
                  </Link>
                </li>
                {/* 3. Court Office Clerk Login */}
                <li>
                  <Link to="/co-login" className="dropdown-item">
                    Court Office
                  </Link>
                </li>
                {/* 4. Advocate / Attorney Login */}
                <li>
                  <Link to="/advocate-login" className="dropdown-item">
                    Attorney
                  </Link>
                </li>
                {/* 5. Judge Login */}
                <li>
                  <Link to="/judge-login" className="dropdown-item">
                    Judge
                  </Link>
                </li>
              </ul>
            </li>

            {/* SIGN UP DROPDOWN: Public Registration Portals */}
            <li className="nav-item dropdown">
              <Link 
                className="nav-link dropdown-toggle" 
                to="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                Sign Up
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {/* Citizen Registration */}
                <li>
                  <Link to="/user-reg" className="dropdown-item">
                    Petitioner
                  </Link>
                </li>
                {/* Advocate / Lawyer Registration */}
                <li>
                  <Link to="/att-signup" className="dropdown-item">
                    Attorney
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;