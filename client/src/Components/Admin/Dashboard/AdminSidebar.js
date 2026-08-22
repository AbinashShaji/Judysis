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
import judge from "../../../Assets/judgeicon.png"

function AdminSidebar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin") != 1) navigate("/admin-login");
  }, []);
  const handleLogout = () => {
    localStorage.setItem("admin", 0);
    toast.success("Logged out successfully.");
    navigate("/admin-login");
    setShowModal(false);
  };

  const handleView = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="row-4">
      <div className="admin-sidebar">
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

        <div className="content-div">
          <div className="div-style">
            <div>
              <label className="label-general">General</label>
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
                 <div className='adjust-space'>
                 <img src={judge} className='image-adjust-1 padding each' alt='User image'/>{' '},{' '},{' '}
                 <Link to={'/admin_view_judges'}>
                 <label className='label-sub'>View Judges</label>
                </Link>
              </div>
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
              <div className="adjust-space">
                <img
                  src={judge}
                  className="image-adjust-1 padding each"
                  alt="User image"
                />{" "}
                , ,{" "}
                <Link to={"/admin_view_judges"}>
                  <label className="label-sub">View Judges</label>
                </Link>
              </div>

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

      {/* Modal for logout confirmation */}
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
