import React, { useEffect } from "react";
import img1 from "../../../Assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";


function AdminNav() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("admin" == 0)) {
      navigate("/admin-login");
    }
  },[navigate]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar nav">
        <div className="container-fluid">
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