/**
 * ============================================================================
 * SERVICE CONFIG: BaseURLMain.js
 * HANDOVER SUMMARY:
 * This file creates a pre-configured Axios HTTP client instance.
 * It automatically includes the backend API base URL and default headers (like JSON content) 
 * so our service components don't have to re-type the server address every time.
 * ============================================================================
 */

import axios from "axios";

const axiosInstance = axios.create({
  // Local backend server address running on port 4048
  baseURL: "http://localhost:4048/judisys_api",

  // Default content type telling the server we are sending JSON data
  headers: {
    "Content-Type": "application/json",
  },

  // Base URL for accessing static uploaded files
  url: "http://localhost:4048/",
});

export default axiosInstance;
