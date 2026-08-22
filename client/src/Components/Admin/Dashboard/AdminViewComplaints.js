import React, { useEffect, useState } from "react";

import img from "../../../Assets/Vecto(2).png";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

function AdminViewComplaints() {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   axiosInstance
  //     .post("/viewAllComplaints")
  //     .then((res) => {
  //       if (res.data.status === 200) {
  //         console.log(res);
  //         setData(res.data.data || []);
  //       } else {
  //         setData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error!", error);
  //     });
  // }, []);

  return (
    <div className="main-div">

      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">User Type</th>
                <th className="table-header">User Name</th>
                <th className="table-header">Complaint</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((advocate) => (
                  <tr>
                    <td className="table-data">{advocate.date.slice(0, 10)}</td>
                    <td className="table-data">
                      {advocate.userId
                        ? 'Client'
                        : advocate.advId
                        ? 'Advocate'
                        : advocate.internId
                        ? 'Intern'
                        : advocate.jrId
                        ? 'Junior Advocate'
                        : ""}
                    </td>
                    <td className="table-data">
                      {advocate.userId
                        ? advocate.userId.name
                        : advocate.advId
                        ? advocate.advId.name
                        : advocate.internId
                        ? advocate.internId.name
                        : advocate.jrId
                        ? advocate.jrId.name
                        : ""}
                    </td>
                    <td className="table-data">{advocate.complaint}</td>
                  </tr>
                ))
              ) : (
                <h1>No Data obtained</h1>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no_data_animation">
          <Lottie animationData={noData} className="no_data_animation" />
        </div>
      )}
    </div>
  );
}

export default AdminViewComplaints;
