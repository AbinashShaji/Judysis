import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../../Styles/AdminMain.css";

import CODashboard from "./CODashboard";
import COSidebar from "./COSidebar";
import COLogin from "../COLogin";
import COAddJudge from "./COAddJudge";
import COViewAlljudges from "./COViewAlljudges";
import COViewSIngleJudge from "./COViewSIngleJudge";
import COViewAllCases from "./COViewAllCases";
import COViewSinglecase from "./COViewSinglecase";
import COViewUsers from "./COViewUsers";
import COViewAllCasesAccepted from "./COViewAllCasesAccepted";
import COViewAcceptedCaseSingle from "./COViewAcceptedCaseSingle";

function COMain({ data }) {
  const navigate = useNavigate(); 

  useEffect(() => {
    if (localStorage.getItem("court") == 0) {
      navigate("/co-login");
    }
  }, [navigate]); 

  return (
    <div className="container-fluid admin_main">
      <div className="row">
        <div
          className="col-lg-3 col-md-6 col-sm-12 adminmain-sidebar"
          style={{ padding: 0 }}
        >
          <COSidebar />
        </div>
        <div className=" col-lg-9 col-md-6 col-sm-12 adminmain-content">
          {data === "co-dashboard" ? (
            <CODashboard />
           ) : data === "add-judge" ? (
              <COAddJudge />
            ) : data === "co-view-judges" ? (
                <COViewAlljudges />
              ) : data === "co-view-single-judge" ? (
                <COViewSIngleJudge />
              ) : data === "co_view_cases" ? (
                <COViewAllCases />
              ) : data === "co-view-singleCase" ? (
                <COViewSinglecase />
              ) : data === "co-viewallusers" ? (
                <COViewUsers />
          ) : data === "co_view_AllAccepted_Cases" ?(
            <COViewAllCasesAccepted/>
          ): data === "co_view_AllAcceptedCases_Single"?(
            <COViewAcceptedCaseSingle/>
          )
           : (
            <COLogin />
          )}
        </div>
      </div>
    </div>
  );
}

export default COMain;