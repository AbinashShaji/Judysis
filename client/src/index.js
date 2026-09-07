/**
 * ============================================================================
 * FILE: index.js (React Application Root Mount Point)
 * HANDOVER SUMMARY:
 * This is the launchpad for the frontend client. It takes our master React component
 * (<App />), connects global styling (Bootstrap and Toast notifications), and mounts
 * everything into the HTML 'root' container so the user can see and interact with the UI.
 * ============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';

// Step 1: Find the 'root' <div> in public/index.html.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Step 2: Render the complete React component tree into the browser DOM.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance metrics helper (optional analytics).
reportWebVitals();
