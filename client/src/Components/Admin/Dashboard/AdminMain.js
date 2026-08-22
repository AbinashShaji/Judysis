import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "../Login/AdminLogin";
import ViewAllAdvocates from "./ViewAllAdvocates";
import ApproveRejectAdvocate from "./AdminViewAdvReqs";
import ViewProfile_AR from "./ViewProfile_AR";
import "../../../Styles/AdminMain.css";

import AdminViewComplaints from "./AdminViewComplaints";
import AdminViewUsers from "./AdminViewUsers";
import AdminViewSingleUsers from "./AdminViewSingleUsers";
import AdminViewAllCases from "./AdminViewAllCases";
import AdminViewSingleCase from "./AdminViewSingleCase";
import AdminViewCaseStatus from "./AdminViewCaseStatus";
import AdminViewEvidences from "./AdminViewEvidences";
import AdminViewPayment from "./AdminViewPayment";
import AdminViewUserReqs from "./AdminViewUserReqs";
import AdminViewAdvReqs from "./AdminViewAdvReqs";
import AdminViewFeedbacks from "./AdminViewFeedbacks";
import AdminViewJudjes from "./AdminViewJudjes";

function AdminMain({ data }) {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (localStorage.getItem("admin") == 0) {
      navigate("/admin-login");
    }
  }, [navigate]); 

  return (
    <div className="container-fluid admin_main">
      <div className="row">
        <div
          className="col-lg-3 col-md-6 col-sm-12 adminmain-sidebar"
          style={{ padding: 0 }}
        >
          <AdminSidebar />
        </div>
        <div className=" col-lg-9 col-md-6 col-sm-12 adminmain-content">
          {data === "admindashboard" ? (
            <AdminDashboard />
          
          ) : data === "admin-adv-reqs" ? (
            <AdminViewAdvReqs />
          ) : data === "adminviewrequest" ? (
            <ViewProfile_AR view="request" />
          ) : data === "adminviewrequest" ? (
            <ViewProfile_AR view="view" />
          ) : data === "adminviewalladvocates" ? (
            <ViewAllAdvocates />
         
          ) : data === "viewSingleCase" ? (
            <AdminViewSingleCase />
          
        
          ) : data === "complaints" ? (
            <AdminViewComplaints />
          ) : data === "adminviewallusers" ? (
            <AdminViewUsers />
          ) : data === "admin-view-single-user" ? (
            <AdminViewSingleUsers />
          ) : data === "admin_view_cases" ? (
            <AdminViewAllCases />
          ) : data === "viewSingleCase" ? (
            <AdminViewSingleCase />
          ) : data === "status" ? (
            <AdminViewCaseStatus />
          ) : data === "evidence" ? (
            <AdminViewEvidences />
          ) : data === "admin_view_feedbacks" ? (
            <AdminViewFeedbacks />
          ) : data === "admin-userreqs" ? (
            <AdminViewUserReqs />
          
          ) : data === "admin_view_judges"?(
            <AdminViewJudjes/>
          )
           : (
            <AdminLogin />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMain;