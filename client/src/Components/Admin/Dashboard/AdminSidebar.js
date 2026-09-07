/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR NAVIGATION SIDEBAR (AdminSidebar.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is the persistent left navigation sidebar for the Administrator dashboard.
 * It provides quick icon-based links for the administrator to manage:
 *   - Users (Citizens registered in the system)
 *   - Advocates (Lawyers who can accept case requests)
 *   - Judges (Judicial bench officers assigned to preside over cases)
 *   - Cases (All court lawsuits filed across the platform)
 *   - Feedbacks (Public feedback and reviews sent by citizens)
 *   - Logout (Securely exits the session with a confirmation popup)
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` as the left navigation panel.
 * - Clicking any link updates the browser route, triggering `AdminMain` to swap
 *   the appropriate content page in the right-hand panel.
 * - Clicking "Logout" opens a Bootstrap modal confirmation dialog. When confirmed,
 *   it sets `admin = 0` in local storage and redirects to `/admin-login`.
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
import judge from "../../../Assets/judgeicon.png";

/**
 * AdminSidebar Component
 * ----------------------
 * Renders the administrator navigation menu with icons and a logout modal.
 */
function AdminSidebar() {
  const navigate = useNavigate();

  // State to control the visibility of the logout confirmation modal popup
  const [showModal, setShowModal] = useState(false);

  /**
   * Effect Hook: Route Guard Check
   * ------------------------------
   * Checks if the admin session key is valid (value === 1). If not, kicks the user to login.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") != 1) navigate("/admin-login");
  }, []);

  /**
   * handleLogout
   * ------------
   * Triggered when the admin confirms logout inside the modal popup:
   * 1. Sets the admin storage key to 0 (logged out).
   * 2. Shows a toast notification.
   * 3. Redirects to the login screen (`/admin-login`).
   * 4. Closes the modal.
   */
  const handleLogout = () => {
    localStorage.setItem("admin", 0);
    toast.success("Logged out successfully.");
    navigate("/admin-login");
    setShowModal(false);
  };

  /**
   * handleView
   * ----------
   * Opens the logout confirmation modal.
   */
  const handleView = () => {
    setShowModal(true);
  };

  /**
   * handleClose
   * -----------
   * Closes the logout confirmation modal without logging out.
   */
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="row-4">
      <div className="admin-sidebar">
        {/* TOP SECTION: Administrator Avatar & Profile Title */}
        <div className="profile-div">
          <Link to={"/admin-dashboard"}>
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <img className="img-style" src={profile} alt="Profile" />
              </div>
              <div className="col-md-8 col-sm-12">
                <label className="profile-label text-light">
                  Administrator
                </label>
              </div>
            </div>
          </Link>
        </div>

        {/* NAVIGATION LINKS LIST */}
        <div className="content-div">
          <div className="div-style">
            <div>
              <label className="label-general">General</label>

              {/* Link to Manage Users (Citizens) */}
              <div className="adjust-space">
                <img
                  src={userimg}
                  className="image-adjust-1 img1-padding each"
                  alt="User image"
                />{" "}
                , ,{" "}
                <Link to={"/admin-viewallusers"}>
                  <label className="label-sub">Users</label>
                </Link>
              </div>

              {/* Link to Manage Advocates (Lawyers) */}
              <div className="adjust-space">
                <img
                  src={advocateimg}
                  className="img2-padding"
                  alt="User image"
                />{" "}
                , ,{" "}
                <Link to="/admin-viewalladvocates">
                  <label className="label-sub">Advocate</label>
                </Link>
              </div>

              {/* Link to View Judges */}
              <div className="adjust-space">
                <img
                  src={judge}
                  className="image-adjust-1 padding each"
                  alt="User image"
                />{" "}
                ,{" "}
                ,{" "}
                <Link to={"/admin_view_judges"}>
                  <label className="label-sub">View Judges</label>
                </Link>
              </div>

              {/* Link to Manage Court Cases */}
              <div className="adjust-space">
                <img
                  src={casesimg}
                  className="image-adjust-1 padding each"
                  alt="User image"
                />{" "}
                , ,{" "}
                <Link to={"/admin_view_cases"}>
                  <label className="label-sub">Cases</label>
                </Link>
              </div>

              {/* Link to View Feedback & Reviews */}
              <div className="adjust-space">
                <img
                  src={rentimg}
                  className="image-adjust-1 padding each-1"
                  alt="User image"
                />{" "}
                ,{" "}
                <Link to={"/admin_view_feedbacks"}>
                  <label className="label-sub padding">Feedback</label>
                </Link>
              </div>

              {/* Logout Action Button */}
              <div className="adjust-space">
                <img
                  src={internimg}
                  className="image-adjust-1 padding each-1"
                  alt="User image"
                />{" "}
                ,{" "}
                <Link to="">
                  <label className="label-sub padding" onClick={handleView}>
                    Logout
                  </label>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL FOR LOGOUT */}
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

export default AdminSidebar;
