import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { register, ViewById } from "../Services/CommonServices";
import "../../Styles/UserAddCases.css";

function CaseHearings() {
  const { id } = useParams();
  const [hearings, setHearings] = useState([]);
  const [newHearing, setNewHearing] = useState({
    hearingDate: "",
    status: "",
    description: "",
    caseId: id,
  });
  const [currentStatus, setCurrentStatus] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch existing hearings
  const fetchHearings = async () => {
    try {
      const result = await ViewById("getStatusByCaseId", id);
      if (result.success) {
        setHearings(result.user || []);
        if (result.user.length > 0) {
          setCurrentStatus(result.user[0].status); // Assuming the latest hearing is first
        } else {
          setCurrentStatus(""); // Reset if no hearings
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching hearings:", error);
      toast.error("Failed to load hearings");
    }
  };

  useEffect(() => {
    fetchHearings();
  }, [id]);

  // Handle input change for new hearing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHearing({ ...newHearing, [name]: value });
  };

  // Handle form submission for adding new hearing
  const handleAddHearing = async (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!newHearing.status) newErrors.status = "Status is required.";
    if (newHearing.status === "Scheduled Next Hearing" && !newHearing.hearingDate)
      newErrors.hearingDate = "Next hearing date is required.";
    if (!newHearing.description) newErrors.description = "Description is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await register(newHearing, "createStatus");
      if (result.success) {
        toast.success("Hearing added successfully!");
        fetchHearings(); // Refresh the hearings
        setNewHearing({ hearingDate: "", status: "", description: "", caseId: id });
        setErrors({}); // Reset errors
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding hearing:", error);
      toast.error("Failed to add hearing");
    }
  };

  return (
    <div className="container">
      <div className="case-hearings container mt-5">
        <center>
          <h2>Case Hearings</h2>
        </center>
        <h4 className="mt-3">Previous Hearings</h4>

        <div className="advocate_home_container2_table table-responsive">
          {hearings.length > 0 ? (
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Sl. No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Next Hearing Date</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {hearings.map((caseReq, index) => (
                  <tr key={caseReq?._id}>
                    <td>{index + 1}</td>
                    <td>{caseReq?.date ? caseReq.date.slice(0, 10) : "N/A"}</td>
                    <td>{caseReq?.status ? caseReq.status.slice(0, 10) : "N/A"}</td>
                    <td>{caseReq?.hearingDate ? caseReq.hearingDate.slice(0, 10) : "N/A"}</td>
                    <td title={caseReq?.description}>{caseReq?.description?.slice(0, 50)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hearings available for this case.</p>
          )}
        </div>

        {currentStatus !== "Closed" && (
          <div className="add_cases_status mt-3 mb-3">
            <h4>Add New Hearing</h4>
            <form onSubmit={handleAddHearing}>
              <div className="row">
                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Status</label>
                  </div>
                  <select
                    className="form-select form-control-lg specialization-form-select mb-2"
                    name="status"
                    onChange={handleInputChange}
                    value={newHearing.status}
                    required
                  >
                    <option value="">Choose an option</option>
                    <option value="Closed">Closed</option>
                    <option value="Scheduled Next Hearing">Scheduled Next Hearing</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                  {errors.status && <div className="text-danger">{errors.status}</div>}
                </div>

                {newHearing.status === "Scheduled Next Hearing" && (
                  <div className="col-6">
                    <div className="user_add_cases_title">
                      <label>Next Hearing Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control border border-dark"
                      name="hearingDate"
                      min={new Date().toISOString().split("T")[0]}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.hearingDate && (
                      <span className="text-danger">{errors.hearingDate}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  value={newHearing.description}
                  onChange={handleInputChange}
                  required
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}
              </div>

              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn bg-gold">
                  Add Case Status
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CaseHearings;
