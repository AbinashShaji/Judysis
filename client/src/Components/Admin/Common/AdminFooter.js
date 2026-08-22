import React, { useEffect } from 'react'
import './AdminFooter.css'
import logo from '../../../Assets/logo2.png'
import { useNavigate } from 'react-router-dom';

function AdminFooter() {
  
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminId" == null)) {
      navigate("/");
    }
  });

  return (
    <div className="admin-footer bg-dark text-white">
      <div className="container-fluid">
        <div className="row align-items-center">
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
          <div className="col-8 col-md-6  text-md-left mt-3 mt-md-0">
            <span className="footer-text">
              © Copyright | All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminFooter