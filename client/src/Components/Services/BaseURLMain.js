import axios from "axios";

const axiosInstance = axios.create({
  //server api
  // baseURL: 'https://hybrid.srishticampus.in/judisys_api',

  //local api s

  baseURL: "http://localhost:4048/judisys_api",

  headers: {
    "Content-Type": "application/json",
  },

  url: "http://localhost:4048/",
  //  url:  "http://hybrid.srishticampus.in"

  //hai
});

export default axiosInstance;
