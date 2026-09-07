/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewUsers.js
 * Path: client/src/Components/CourtOffice/Dashboard/COViewUsers.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component provides Court Office staff with a master directory of all
 * registered citizens (litigants) who use the judicial portal.
 * Registry staff can verify citizen identity records, including full names,
 * contact phone numbers, emails, city locations, and government Aadhar numbers.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-viewallusers` inside the `COMain` shell container.
 * - Data Journey:
 *   1. Queries backend endpoint `/viewAllUsers` on component load.
 *   2. Formats all registered citizens into a responsive tabular directory.
 *   3. If no users exist, displays an animated empty state illustration.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css';
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";

/**
 * COViewUsers Component
 * Renders the table of registered citizens for court registry oversight.
 */
function COViewUsers() {
  // State storing the list of registered users
  const [data, setData] = useState([]);

  /**
   * fetchdata
   * Retrieves all user records from the database.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAllUsers');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('Court Office View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading users');
    }
  };

  // Run fetch on mount
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {data.length !== 0 ? (
        <>
          <h3 className="mt-5 mb-3">Users</h3>
          <div className="table-container table-striped">
            <table className="table-change container-fluid">
              <thead className="thead-dark">
                <tr>
                  <th className="table-header fw-bolder">Name</th>
                  <th className="table-header fw-bolder">Email</th>
                  <th className="table-header fw-bolder">Contact</th>
                  <th className="table-header fw-bolder">Aadhar Number</th>
                  <th className="table-header fw-bolder">City</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id}>
                    {/* User Identity Details */}
                    <td className="table-data">{user.name}</td>
                    <td className="table-data">{user.email}</td>
                    <td className="table-data">{user.contact}</td>
                    <td className="table-data">{user.aadhar}</td>
                    <td className="table-data">{user.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Empty state animation if database has no registered citizens */
        <div className="no_data_animation">
          <Lottie animationData={noData} className="no_data_animation" />
        </div>
      )}
    </div>
  );
}

export default COViewUsers;

