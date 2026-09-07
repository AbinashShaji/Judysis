/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: CODashboard.js
 * Path: client/src/Components/CourtOffice/Dashboard/CODashboard.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the primary summary dashboard for Court Office Registry staff.
 * It displays real-time operational KPI metric cards showing:
 * 1. Total Registered Citizens (Users) in the judicial system.
 * 2. Total Cases filed in the court system.
 * 3. Total Courtroom Judges currently on the registry.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-dashboard` inside the `COMain` shell container.
 * - Data Journey:
 *   1. Calls `/viewAllUsers` to count the total citizens.
 *   2. Calls `/getAllCases` to count the total case filings.
 *   3. Calls `/viewAdvocates` to count active judicial officers.
 *   4. Populates the 3 dashboard stat cards with live numeric counts.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../../Styles/AdminDashboard.css";
import userimg from "../../../Assets/Vector (1).png";
import casesimg from "../../../Assets/Vector (2).png";
import adimg from "../../../Assets/image 19.png";
import complaintimg from "../../../Assets/codiconbriefcase.png";

import { viewCount } from "../../Services/AdminService";
import { toast } from "react-toastify";

/**
 * CODashboard Component
 * Renders high-level statistical counter cards for court office management.
 */
function CODashboard() {
  // State variables storing counts for users, judges, cases, and complaints
  const [userCount, setUserCount] = useState(0);
  const [advocateCount, setAdvocateCount] = useState(0);
  const [cases, setCases] = useState(0);
  const [complaints, setComplaints] = useState(0);

  /**
   * fetchdata
   * Fetches active courtroom judge records from the database.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAdvocates');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setAdvocateCount(result.user);
        else
          setAdvocateCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading judge statistics');
    }
  };

  /**
   * fetchuserdata
   * Fetches all registered citizen records to calculate the total user base.
   */
  const fetchuserdata = async () => {
    try {
      const result = await viewCount('viewAllUsers');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setUserCount(result.user);
        else
          setUserCount([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading user statistics');
    }
  };

  /**
   * fetchCasedata
   * Fetches all filed lawsuits across the system to calculate total cases handled.
   */
  const fetchCasedata = async () => {
    try {
      const result = await viewCount('getAllCases');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setCases(result.user);
        else
          setCases([]);
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading case statistics');
    }
  };

  /**
   * Initial Load Effect:
   * Requests all three metric counts simultaneously when the dashboard opens.
   */
  useEffect(() => {
    fetchdata();
    fetchuserdata();
    fetchCasedata();
  }, []);

  return (
    <div className="container">
      <div className="row dashboard-adjust mt-5">
        {/* Card 1: Registered Citizens / Users Metric */}
        <div className="col-12 col-sm-6 col-md-4 mb-4 adjust-box">
          <div className="dashbord-box">
            <img className="image-adjust" src={userimg} alt="Users Icon" />
            <div className="text-container">
              <label className="count-label">{userCount.length || 0}</label>
              <label className="content-label">Users</label>
            </div>
          </div>
        </div>

        {/* Card 2: Total Lawsuit Filings Metric */}
        <div className="col-12 col-sm-6 col-md-4 mb-4">
          <div className="dashbord-box">
            <img className="image-adjust" src={casesimg} alt="Cases Icon" />
            <div className="text-container">
              <label className="count-label">{cases.length || 0}</label>
              <label className="content-label">Cases</label>
            </div>
          </div>
        </div>

        {/* Card 3: Total Active Judges Metric */}
        <div className="col-12 col-sm-6 col-md-4 mb-4">
          <div className="dashbord-box">
            <img className="image-adjust" src={adimg} alt="Judges Icon" />
            <div className="text-container">
              <label className="count-label">{advocateCount.length || 0}</label>
              <label className="content-label">Judges</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CODashboard;