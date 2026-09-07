/**
 * ============================================================================
 * COMPONENT: LandingServices.js (Services Overview Page)
 * HANDOVER SUMMARY:
 * This component displays the 3 pillars of JudiSys services:
 * 1. Expert Legal Advice (Advocate consultations)
 * 2. Case Representation (Courtroom advocacy)
 * 3. Case Tracking (Live hearing progress updates)
 * 
 * SMART RENDERING FLOW:
 * Automatically checks localStorage to render the appropriate navbar:
 * - If a citizen is logged in: Shows <UserNavbar />
 * - If an advocate is logged in: Shows <AdvocateNavbar />
 * - Otherwise: Shows the public <LandingNavbar />
 * ============================================================================
 */

import React from 'react';
import '../../Styles/LandingServices.css';
import img1 from "../../Assets/law11.jpeg";
import img3 from "../../Assets/law12.jpg";
import img2 from "../../Assets/img22.jpeg";
import UserNavbar from "../User/UserNavbar";
import AdvocateNavbar from "../Advocates/AdvocateNavbar";
import LandingNavbar from './LandingNavbar';

function LandingServices() {
  // Check active user session
  const userId = localStorage.getItem("user");
  const advocateId = localStorage.getItem("advocate");

  return (
    <>
      {/* Conditionally render header depending on who is browsing */}
      {userId ? (
        <UserNavbar />
      ) : advocateId ? (
        <AdvocateNavbar />
      ) : (
        <LandingNavbar />
      )}

      <div className='landinservicealign'>
        <h1 className='landinserviceh1'> Our Services</h1>

        {/* 3 Service Feature Cards */}
        <div className="container">
          <div className="row">
            {/* Service 1: Legal Consultation */}
            <div className="col-md-4">
              <div className="card h-100">
                <img className="card-img-top landinserviceimg" src={img2} alt="Expert Legal Advice" />
                <div className="card-body">
                  <h5 className="card-title">Expert Legal Advice</h5>
                  <p className="card-text text-justify service-justify">
                    Our experienced advocates provide expert legal advice on various legal matters. Whether you need guidance on family law, business law, or criminal law, we've got you covered.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 2: Courtroom Representation */}
            <div className="col-md-4">
              <div className="card h-100">
                <img className="card-img-top landinserviceimg" src={img1} alt="Case Representation" />
                <div className="card-body">
                  <h5 className="card-title">Case Representation</h5>
                  <p className="card-text text-justify service-justify">
                    Hire our skilled advocates to represent you in court. We handle cases with professionalism and dedication, ensuring the best possible outcome for our clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Service 3: Real-Time Hearing Progress Tracking */}
            <div className="col-md-4">
              <div className="card h-100">
                <img className="card-img-top landinserviceimg" src={img3} alt="Case Tracking" />
                <div className="card-body">
                  <h5 className="card-title">Case Tracking</h5>
                  <p className="card-text text-justify service-justify">
                    Track the status of your case in real-time through our online portal. Receive updates, court dates, and documentation, ensuring you are informed every step of the way.
                  </p>
                </div>
              </div>
            </div>

          </div>
          <br />
        </div>
      </div>
    </>
  );
}

export default LandingServices;