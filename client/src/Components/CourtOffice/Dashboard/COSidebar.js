/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COSidebar.js
 * Path: client/src/Components/CourtOffice/Dashboard/COSidebar.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the primary left-hand navigation sidebar for the Court Office.
 * It provides staff clerks with fast, one-click access to all registry duties:
 * - Viewing all registered citizens ("Users")
 * - Inspecting newly filed lawsuits ("New Cases")
 * - Tracking cases assigned to judges ("Accepted Cases")
 * - Managing courtroom judges ("Judges")
 * - Securely logging out via a confirmation modal dialog.
 * 
 * ROUTING & RENDERING FLOW:
 * - Rendered inside: `COMain.js` (fixed in the left 3-column pane).
 * - Navigation Destinations:
 *   - "Users" -> Navigates to `/co-viewallusers`.
 *   - "New Cases" -> Navigates to `/co_view_cases`.
 *   - "Accepted Cases" -> Navigates to `/co_view_AllAccepted_Cases`.
 *   - "Judges" -> Navigates to `/co-view-judges`.
 *   - "Logout" -> Pops up a confirmation modal. On confirm, sets `localStorage.setItem("court", 0)`
 *     and redirects to `/co-login`.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../Styles/AdminSidebar.css";
import userimg from "../../../Assets/carbondashboard.png";
import advocateimg from "../../../Assets/openmoji.png";
import casesimg from "../../../Assets/Gro-up.png";
import enquiryimg from "../../../Assets/Vector5.png";
import juniorimg from "../../../Assets/arcticons.png";
import internimg from "../../../Assets/material.png";
import rentimg from "../../../Assets/recentIcon6.png";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import profile from "../../../Assets/5856.jpg";

/**
 * COSidebar Component
 * Renders the persistent vertical navigation menu for Court Office personnel.
 */
function COSidebar() {
  const navigate = useNavigate();
  // State controlling the logout confirmation modal popup
  const [showModal, setShowModal] = useState(false);

  /**
   * Security Check:
   * Confirms Court Office authentication key is active in localStorage.
   */
  useEffect(() => {
    if (localStorage.getItem("court") != 1) {
      navigate("/co-login");
    }
  }, [navigate]);

  /**
   * handleLogout
   * Deactivates session token and redirects to login.
   */
  const handleLogout = () => {
    localStorage.setItem("court", 0);
    toast.success("Logged out successfully.");
    navigate("/co-login");
    setShowModal(false);
  };

  // Open confirmation modal
  const handleView = () => {
    setShowModal(true);
  };

  // Close confirmation modal
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="row-4">
      <div className="admin-sidebar">
        {/* Profile Card Header */}
        <div className="profile-div">
          <Link to="#">
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <img className="img-style" src={profile} alt="Profile" />
              </div>
              <div className="col-md-8 col-sm-12">
                <label className="profile-label text-light">Court Office</label>
              </div>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="content-div">
          <div className="div-style">
            <div>
              <label className="label-general">General</label>

              {/* 1. View Users / Citizens */}
              <div className="adjust-space">
                <img
                  src={userimg}
                  className="image-adjust-1 img1-padding each"
                  alt="User image"
                />
                <Link to={"/co-viewallusers"}>
                  <label className="label-sub">Users</label>
                </Link>
              </div>

              {/* 2. View New Unassigned Cases */}
              <div className="adjust-space">
                <img
                  src={casesimg}
                  className="image-adjust-1 padding each"
                  alt="Cases image"
                />
                <Link to={"/co_view_cases"}>
                  <label className="label-sub">New Cases</label>
                </Link>
              </div>

              {/* 3. View Accepted / Assigned Cases */}
              <div className="adjust-space">
                <img
                  src={casesimg}
                  className="image-adjust-1 padding each"
                  alt="Accepted cases image"
                />
                <Link to={"/co_view_AllAccepted_Cases"}>
                  <label className="label-sub">Accepted Cases</label>
                </Link>
              </div>

              {/* 4. View Judges Directory */}
              <div className="adjust-space">
                <img
                  src={juniorimg}
                  className="image-adjust-1 padding each"
                  alt="Judges image"
                />
                <Link to={"/co-view-judges"}>
                  <label className="label-sub">Judges</label>
                </Link>
              </div>

              {/* 5. Logout Trigger Button */}
              <div className="adjust-space">
                <img
                  src={internimg}
                  className="image-adjust-1 padding each-1"
                  alt="Logout icon"
                />
                <Link to="#">
                  <label className="label-sub padding" onClick={handleView}>
                    Logout
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Logout Confirmation */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default COSidebar;

