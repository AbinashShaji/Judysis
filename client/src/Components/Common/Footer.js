/**
 * ============================================================================
 * COMPONENT: Footer.js (Standard Public Footer)
 * HANDOVER SUMMARY:
 * A simple, dark-themed footer component used on public landing sections 
 * showing copyright and policy information.
 * ============================================================================
 */

import React from 'react';

function Footer() {
  return (
    <div>
      <footer className="bg-dark text-light text-center py-3">
        <div className="container">
          <p>&copy; 2024 Legal Practice Management System</p>
          <p>All rights reserved. Terms of Service | Privacy Policy</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;