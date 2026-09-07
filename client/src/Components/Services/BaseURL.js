/**
 * ============================================================================
 * SERVICE CONFIG: BaseURL.js
 * HANDOVER SUMMARY:
 * This file contains the master network addresses that our React frontend uses
 * to talk to our Node.js backend server.
 * 
 * WHY IT MATTERS:
 * If our backend server changes its port (e.g., from 4048 to 5000) or gets deployed
 * to a cloud server, updating this single file automatically updates all API calls
 * across the entire application!
 * ============================================================================
 */

// Base URL for viewing uploaded documents, photos, and evidence files.
// Example: http://localhost:4048/prefix-myimage-12345.jpg
export const IMG_BASE_URL = 'http://localhost:4048/';

// Base API route prefix for all data operations (login, cases, chat, hearings).
// Example: http://localhost:4048/judisys_api/registerUser
export const API_BASE_URL = 'http://localhost:4048/judisys_api';

// Production deployment URLs (kept as handy reference for cloud deployment):
// export const IMG_BASE_URL = 'http://hybrid.srishticampus.in';
// export const API_BASE_URL = 'https://hybrid.srishticampus.in/judisys_api';
