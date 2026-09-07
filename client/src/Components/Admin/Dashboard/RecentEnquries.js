/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR RECENT ENQUIRIES CARD (RecentEnquries.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This is a dashboard notification panel widget that displays recent inquiries,
 * messages, and incoming queries submitted by citizens or visitors.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered within the Administrator dashboard overview.
 * - Checks `localStorage` on render to verify that an administrator is active;
 *   redirects unauthorized guests to `/`.
 * ==============================================================================
 */

import React, { useEffect } from 'react';
import '../Admin/RecentEnquries.css';
import enquiry from '../../Assets/mdi_push-notification-outline.png';
import { useNavigate } from 'react-router-dom';

/**
 * RecentEnquries Component
 * ------------------------
 * Displays the recent enquiries banner with icon and message placeholder.
 */
function RecentEnquries() {
  const navigate = useNavigate();

  /**
   * Effect Hook: Route Authentication Guard
   * ---------------------------------------
   * Checks whether the admin session exists. Redirects to homepage if missing.
   */
  useEffect(() => {
    if (localStorage.getItem("adminId" == null)) {
      navigate("/");
    }
  });

  return (
    <div className='container-fluid'>
      <div className='enquries-div'>
        {/* Enquiries Widget Header with Bell / Notification Icon */}
        <div className='enquries-div-1'>
          <img src={enquiry} alt="Enquiry Notification Icon" />
          <label>Recent Enquries</label>
        </div>
        <div className='enquries-div-1'>
          {/* Container for recent enquiry message stream */}
        </div>
      </div>
    </div>
  );
}

export default RecentEnquries;