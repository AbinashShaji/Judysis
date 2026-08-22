import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/LandingNavbar.css';
import img1 from '../../Assets/logo2.png'; 

function LandingNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark landing_custom_navbar landing_custom_-right">
      <div className="container-fluid ">
        {/* <Link className="navbar-brand" to="#home"> */}
          <img
            alt="Logo"
            src={img1}
            width="70"
            height="80"
            className="d-inline-block align-top"
          />{' '}
          JudiSys
        {/* </Link> */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0 mt-3 landingnavbar_text" >

          <ul className="navbar-nav me-auto mb-2 mb-lg-0" >
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutus">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
     
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
  <li>
      <Link to="/admin-login" className="dropdown-item">
        Admin
      </Link>
    </li>
    <li>
      <Link to="/user-login" className="dropdown-item">
      Petitioner
      </Link>
    </li>
    <li>
      <Link to="/co-login" className="dropdown-item">
       Court Office
      </Link>
    </li>
    <li>
      <Link to="/advocate-login" className="dropdown-item">
       Attorney
      </Link>
    </li>
    <li>
      <Link to="/judge-login" className="dropdown-item">
       Judge
      </Link>
    </li>
  </ul>
</li>

          
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Sign Up
              </Link>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
             
    <li>
      <Link to="/user-reg" className="dropdown-item">
      Petitioner
      </Link>
    </li>
    <li>
      
    </li>
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