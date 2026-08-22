import React from "react";
import "../../Styles/UserFooter.css";
import logo from "../../Assets/logo2.png";
import { Link } from "react-router-dom";

function UserFooter() {
  const userId = localStorage.getItem("user");
  const advocateId = localStorage.getItem("advocate");

  return (
    <div className="user-footer container-fluid">
      <div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <img
              className="col-4 footer-img"
              src={logo}
              alt="Admin Footer Logo"
            />
            <span className="footer-logo-text-change1 ml-2">JudiSys</span>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h2 className="footer-title lawyer">Lawyer</h2>
            <p className="footer-list lawyer-intro">
              Welcome to JudiSys. Your trusted Partner in legal services. We are
              a team of dedicated and experienced legal professionals commited
              to providing high-quality legal solutions tailored to your needs.
            </p>
          </div>

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
                  {" "}
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
                  {" "}
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
                  {" "}
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
                {" "}
                <li className="list-style">About Us</li>{" "}
              </Link>
              <Link
                to="/services"
                style={{
                  textDecoration: "none",
                  color: "rgba(252, 249, 249, 0.216)",
                }}
              >
                {" "}
                <li className="list-style">Services</li>
              </Link>
              {/* <li className='list-style'>Blog</li> */}
            </ul>
          </div>

          {/* <div className='col-lg-2 col-md-6 col-sm-12'>
            <h2 className='footer-title legal'>Our Legal</h2>
                <ul className='footer-list'>
                <li className='list-style'>Civil Law</li>
                <li className='list-style'>Family Law</li>
                <li className='list-style'>Business Law</li>
                <li className='list-style'>Criminal Law</li>
            </ul>
            </div> */}

          <div className="col-lg-2 col-md-6 col-sm-12">
            <h2 className="footer-title help">Help</h2>
            <ul className="footer-list">
              <li className="list-style">judisyinfo@gmail.com</li>
              {/* <li className='list-style'>Become an Afflicate</li> */}
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
