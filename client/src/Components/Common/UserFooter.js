/**
 * ============================================================================
 * COMPONENT: UserFooter.js (Comprehensive Footer with Dynamic Role Links)
 * HANDOVER SUMMARY:
 * This is the multi-column footer seen across all citizen and public screens.
 * It contains the platform branding, quick navigation links (which intelligently adapt
 * whether the current viewer is a Citizen, an Advocate, or an unregistered guest),
 * and official support contact email.
 * ============================================================================
 */

import React from "react";
import "../../Styles/UserFooter.css";
import logo from "../../Assets/logo2.png";
import { Link } from "react-router-dom";

function UserFooter() {
  // Check active user role from browser storage
  const userId = localStorage.getItem("user");
  const advocateId = localStorage.getItem("advocate");

  return (
    <div className="user-footer container-fluid">
      <div>
        <div className="row">
          {/* Column 1: Logo and Brand Name */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <img
              className="col-4 footer-img"
              src={logo}
              alt="Admin Footer Logo"
            />
            <span className="footer-logo-text-change1 ml-2">JudiSys</span>
          </div>

          {/* Column 2: Platform Purpose Summary */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h2 className="footer-title lawyer">Lawyer</h2>
            <p className="footer-list lawyer-intro">
              Welcome to JudiSys. Your trusted Partner in legal services. We are
              a team of dedicated and experienced legal professionals committed
              to providing high-quality legal solutions tailored to your needs.
            </p>
          </div>

          {/* Column 3: Quick Navigation Links */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h2 className="footer-title quick">Quick Links</h2>
            <ul className="footer-list">
              {userId ? (
                <Link
                  to="/user-home"
                  style={{
                    textDecoration: "none",
                    color: "rgba(252, 249, 249, 0.216)",
                  }}
                >
                  <li className="list-style">Home</li>
                </Link>
              ) : advocateId ? (
                <Link
                  to="/advocate-home"
                  style={{
                    textDecoration: "none",
                    color: "rgba(252, 249, 249, 0.216)",
                  }}
                >
                  <li className="list-style">Home</li>
                </Link>
              ) : (
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "rgba(252, 249, 249, 0.216)",
                  }}
                >
                  <li className="list-style">Home</li>
                </Link>
              )}
              <Link
                to="/aboutus"
                style={{
                  textDecoration: "none",
                  color: "rgba(252, 249, 249, 0.216)",
                }}
              >
                <li className="list-style">About Us</li>
              </Link>
              <Link
                to="/services"
                style={{
                  textDecoration: "none",
                  color: "rgba(252, 249, 249, 0.216)",
                }}
              >
                <li className="list-style">Services</li>
              </Link>
            </ul>
          </div>

          {/* Column 4: Help and Support Contact */}
          <div className="col-lg-2 col-md-6 col-sm-12">
            <h2 className="footer-title help">Help</h2>
            <ul className="footer-list">
              <li className="list-style">judisyinfo@gmail.com</li>
            </ul>
          </div>
          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default UserFooter;
