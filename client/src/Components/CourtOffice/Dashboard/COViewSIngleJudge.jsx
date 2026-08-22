import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../Styles/ViewProfile_AR.css";
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { resetPassword, ViewById } from "../../Services/CommonServices";

function COViewSingleJudge({ view }) {
  const [advocate, setAdvocate] = useState(null);
  const [data, setData] = useState({});
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  const fetchdata = async () => {
    try {
      const result = await ViewById("viewJudgeById", id);
      if (result.success) {
        if (result.user) {
          setAdvocate(result.user);
          setData(result.user); // Set initial form data
        } else {
          setAdvocate({});
        }
      } else {
        console.error(" View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during login");
    }
  };

  useEffect(() => {
    fetchdata();
  }, [id]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Call API to update the judge details
      console.log("Updated Data:", data);

      // Assume an API function `editJudgeById`
      const result = await resetPassword( data,"editJudgeById", id,);

      if (result.success) {
        toast.success("Details updated successfully!");
        fetchdata(); // Refresh data
        setIsEditing(false); // Exit edit mode
      } else {
        toast.error("Failed to update details");
      }
    } catch (error) {
      console.error("Error while updating:", error);
      toast.error("An error occurred while updating");
    }
  };

  if (!advocate) {
    return "";
  }

  return (
    <div className="container-fluid mt-4 ms-3">
      <div className="row justify-content-center mt-5">
        <div className="admin_view_advocate_img text-center">
          <br />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={data.name || ""}
              onChange={handleChange}
              className="form-control"
            />
          ) : (
            <label className="advocate-name d-block mt-3">{advocate.name}</label>
          )}
          <label className="experience-label d-block">
            {advocate.experience} Years of Experience
          </label>
          <br />
        </div>
        <div className="col-lg-8 col-md-6 col-sm-12">
          <div>
            <table className="table custom-table">
              <tbody>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">E-Mail</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={data.email || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <label className="sub-label">{advocate.email}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="text"
                        name="contact"
                        value={data.contact || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    ) : (
                      <label className="sub-label">{advocate.contact}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Area</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={data.specialization || ""}
                        onChange={handleChange}
                        className="form-control"
                        readOnly
                      />
                    ) : (
                      <label className="sub-label">{advocate.specialization}</label>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    {isEditing ? (
                      <input
                        type="number"
                        name="experience"
                        value={data.experience || ""}
                        onChange={handleChange}
                        className="form-control"
                        
                      />
                    ) : (
                      <label className="sub-label">{advocate.experience} years</label>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="row mt-3">
              <center>
                {isEditing ? (
                  <button
                    type="button"
                    className="btn btn-secondary w-50 mt-3"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary w-50 mt-3"
                    onClick={toggleEditMode}
                  >
                    Edit Data
                  </button>
                )}
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default COViewSingleJudge;
