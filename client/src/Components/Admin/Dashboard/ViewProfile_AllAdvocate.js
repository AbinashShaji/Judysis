import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../Services/BaseURLMain";
// import axiosInstance from '../../Services/BaseURL';
// import '../Admin/ViewProfile_AR.css';
import { IMG_BASE_URL } from "../../Services/BaseURL";

function ViewProfile_AllAdvocate() {
  const [advocate, setAdvocate] = useState(null);
  const { id } = useParams();
  const url = axiosInstance.defaults.url;

  useEffect(() => {
    axiosInstance
      .post(`/viewAdvocateById/${id}`)
      .then((response) => {
        console.log(response);

        setAdvocate(response.data.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the advocate details!",
          error
        );
      });
  }, [id]);

  const handleActivate = (id) => {
    axiosInstance.post(`/activateAdvocateById/${id}`)
        .then(res => {
            if (res.data.status === 200) {
                setAdvocate(prevState => ({ ...prevState, isActive: true }));
            }
        })
        .catch(error => {
            console.error("Error!", error);
        });
  };

  const handleDeactivate = (id) => {
    axiosInstance.post(`/deactivateAdvocateById/${id}`)
        .then(res => {
            if (res.data.status === 200) {
                setAdvocate(prevState => ({ ...prevState, isActive: false }));
            }
        })
        .catch(error => {
            console.error("Error!", error);
        });
  };

  if (!advocate) {
      return '';
  }

//Age Calculation

  const calculateAge = (dob) => {
    if (!dob) return "N/A"; 
    const birthDate = new Date(dob); 
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="container-fluid mt-5" >
      <div className="row justify-content-center">
        <div className="col-4 text-center">
          {/* <img src={img} className="img-fluid rounded" alt="Advocate" /><br /> */}
          <img
            src={`${IMG_BASE_URL}/${advocate?.profilePic.filename}`}
            className="img-fluid rounded"
            alt="Advocate"
          />

          <label className="advocate-name d-block mt-3">{advocate?.name}</label>
          <label className="practice-area d-block">Practice Area</label>
          <label className="experience-label d-block">
            {advocate?.experience} Years of Experience in Various Cases
          </label>
          <br />
          {/* <Link className="link-label" to="">
            View Id Proof
          </Link> */}
        <p>Id Proof : </p>
          <img
            src={`${IMG_BASE_URL}/${advocate?.idProof?.filename}`}
            width="400px"
            height="200px"
            style={{objectFit:"contain"}}
            // className="img-fluid rounded"
            alt="Advocate"
          />
        </div>
        <div className="col-4 mt-5">
          <div>
            <table className="table custom-table">
              <tbody>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">
                      Bar Council Enrollment Number
                    </label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.bcNo}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.contact}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Email Id</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.email}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Areas</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {advocate?.specialization}
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate?.experience}</label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Age</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {/* {advocate?.qualification} */}
                      {calculateAge(advocate?.dob)}
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Professional Experience</label>
                  </td>
                  <td className="left-alignn">:</td>
                  <td className="left-alignn">
                    <label className="sub-label">
                      {advocate?.experience} years
                    </label>
                  </td>
                </tr>

                {advocate.isActive ? (
                                            <button
                                                className="btn btn-outline-danger button-size1"
                                                onClick={() => handleDeactivate(advocate._id)}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline-success button-size1"
                                                onClick={() => handleActivate(advocate._id)}
                                            >
                                                Activate
                                            </button>
                                        )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile_AllAdvocate;
