import React, { useEffect, useState } from "react";
import "../../../Styles/ViewAllAdvocates.css";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { approveById, viewCount } from "../../Services/AdminService";
import { toast } from "react-toastify";

function ViewAllAdvocates() {
  const [data, setData] = useState([]);

  const handleActivate = async(id) => {
    try {
      const result = await approveById('activateAdvocateById',id);

      if (result.success) {
          console.log(result);
         fetchdata()
      } else {
          console.error('View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
    
  };

  const handleDeactivate =async (id) => {
    try {
      const result = await approveById('deactivateAdvocateById',id);

      if (result.success) {
          console.log(result);
        fetchdata()
      } else {
          console.error(' View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
  }
  };
  const fetchdata = async () => {
    try {
        const result = await viewCount('viewAdvocates');

        if (result.success) {
            console.log(result);
            if(result.user.length>0)
            setData(result.user);
          else
          setData([])
        } else {
            console.error('Village Office View Error :', result);
            toast.error(result.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
    }
};
  useEffect(() => {
  
  fetchdata();
  }, []);

  return (
    <div className="main-div">
      <Link
        to="/admin-adv-reqs"
        className="admin-user-req-linkh3"
        style={{ fontSize: "20px", fontWeight: "700" }}
      >
        View Advocate request
      </Link>

      {data.length > 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header">Bar council Enrolment No</th>
                <th className="table-header">Advocate Name</th>
                <th className="table-header">Specialization areas</th>
                <th className="table-header">Contact</th>
                {/* <th className="table-header">Educational qualification</th> */}
                <th className="table-header">Years of Experience</th>
                <th className="table-header">View full Details</th>
                <th className="table-header">User Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((advocate) => (
                  <tr>
                    <td className="table-data">{advocate.bcNo}</td>
                    <td className="table-data">{advocate.name}</td>
                    <td className="table-data">{advocate.specialization}</td>
                    <td className="table-data">{advocate.email}</td>
                    {/* <td className="table-data">{advocate.qualification}</td> */}
                    <td className="table-data">{advocate.experience} years</td>
                    <td className="table-data">
                      <Link to={`/admin_view_single_advocate/${advocate._id}`}>
                        <button className="btn1 btn btn-outline-secondary">
                          <img src={img} alt="View Details" />
                        </button>
                      </Link>
                    </td>{" "}
                    {console.log(advocate.isActive)}
                    <td className="table-data">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size1 p-3 mr-2"
                          style={{ paddingRight: "15px" }}
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size1 p-3 mr-2"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <h1>No Data obtained</h1>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-advocates">
          <h1>No New Requests</h1>
        </div>
      )}
    </div>
  );
}

export default ViewAllAdvocates;
