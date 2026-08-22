import React, { useEffect, useState } from "react";
import "../../Styles/UserAddCases.css";
import { toast } from "react-toastify";
import 'remixicon/fonts/remixicon.css';
import { IMG_BASE_URL } from '../Services/BaseURL';
import { AddCase, registerWithFile, ViewById } from "../Services/CommonServices";
import { Link, useNavigate } from "react-router-dom";

function UserAddCases() {

  const [status, setStatus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [advSug, setAdvSug] = useState([]);
  const [caseId, setCaseId] = useState('');

  const id = localStorage.getItem("user");
  const [data, setData] = useState({
    userId:id,
    description:''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchSuggestion=async()=>{
    if (data.description) {
      try {
        console.log(data);
  
        const result =await ViewById('getCaseType',data.description);
  
       setSuggestions(result.user|| [])
console.log(result)

      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during Registration');
      }
  }
}
  useEffect(() => {
    fetchSuggestion()
    
  }, [data.description]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const validate = () => {
    const newErrors = {};
  
    if (!data.title) {
      console.log("here");

      newErrors.title = 'Title is required';
    } 

    if (!data.description) {
      newErrors.description = 'description is required';
    }

    if (!data.type) {
      newErrors.type = 'Type is required';
    }
   
    if (!data.dateOfIncident) {
      newErrors.dateOfIncident = 'Date is required';
    }
    if (!data.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(errors);


    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    try {
      console.log(data);

      const result = await AddCase(data, 'createCase');

      if (result.success) {
        console.log(result);
        setAdvSug(result.suggestions||[]);
        setCaseId(result.user._id)
        console.log("case Id"+result.user._id);
        

        toast.success('Case Added successfully!');
        // navigate('/user-login');


      } else {
        console.error('Registration error:', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during Registration');
    }

  };
  const handleImageChange = (e) => {
    console.log("in file", e.target.files[0]);

    const file = e.target.files[0];
    setData({
      ...data,
      evidence: file,
    });
  };


  return (
    <div className="user_add_cases">
      <div className="container">
        <div className="row">
          <div className="col-7">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="row">
                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Title</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="title"
                      value={data.title}
                      onChange={handleChange}
                    
                    />
                  </div>
                  {errors.title && (
                    <span className="text-danger px-3">{errors.title}</span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Description</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <textarea
                      className="form-control border border-dark mb-2"
                      name="description"
                      value={data.description}
                      onChange={handleChange}
                    
                    />
                  </div>
                  {errors.description && (
                    <span className="text-danger px-3">
                      {errors.description}
                    </span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Type</label>
                  </div>
                </div>
                <div className="col-6">
               {   console.log(suggestions)}
                  
                  {suggestions.length ? (
                    <div className="px-3 mb-1 text-danger">
                      <b>Suggestions</b>: {suggestions.join(", ")}
                    </div>
                  ) : (
                    ""
                  )}
                  {errors.type &&  (
                    <span className="text-danger px-3">{errors.type}</span>
                  )}
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                  
                         <select className='form-select form-control-lg specialization-form-select mb-2'
                          name='type'
                           onChange={handleChange} 
                           value={data.type}>
                       
                      <option value="" >
                        Select your Specialization Area
                      </option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Civil Litigation">Civil Litigation</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Intellectual Property Law">
                        Intellectual Property Law
                      </option>
                      <option value="Environmental Law">
                        Environmental Law
                      </option>
                      <option value="Tax Law">Tax Law</option>
                      <option value="Real Estate Law">Real Estate Law</option>
                      <option value="Constitutional Law">
                        Constitutional Law
                      </option>
                      <option value="Human Rights Law">Human Rights Law</option>
                      <option value="International Law">
                        International Law
                      </option>
                      <option value="Banking and Finance Law">
                        Banking and Finance Law
                      </option>
                      <option value="Immigration Law">Immigration Law</option>
                      <option value="Cyber Law">Cyber Law</option>
                      <option value="Health Care Law">Health Care Law</option>
                    </select>
                  </div>

                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Date of Incident</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="date"
                      className="form-control border border-dark"
                      name="dateOfIncident"
                      value={data.dateOfIncident}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                    
                    />
                  </div>
                  {errors.dateOfIncident  && (
                    <span className="text-danger px-3">
                      {errors.dateOfIncident}
                    </span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Opposing Party Name</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="opponentName"
                      value={data.opponentName}
                      onChange={handleChange}
                     
                    />
                  </div>
                  {errors.opponentName && (
                    <span className="text-danger px-3">
                      {errors.opponentName}
                    </span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Opposing Party Address</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="opponentAddress"
                      value={data.opponentAddress}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.opponentAddress  && (
                    <span className="text-danger px-3">
                      {errors.opponentAddress}
                    </span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Case Location</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      name="location"
                      value={data.location}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.location && (
                    <span className="text-danger px-3">{errors.location}</span>
                  )}
                </div>

                <div className="col-6">
                  <div className="user_add_cases_title">
                    <label>Upload Evidence/Document</label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-between">
                    <div>: &nbsp;</div>
                    <input
                      type="file"
                      className="form-control border border-dark"
                      name="evidence"
                      onChange={handleImageChange}
                    />
                  </div>
                  {errors.evidence  && (
                    <span className="text-danger px-3">{errors.evidence}</span>
                  )}
                </div>

                <div className="col-12 text-center mt-3">
                  <button type="submit" className="btn bg-gold">
                    Add Case
                  </button>
                </div>
              </div>
            </form>
          </div>
          {
            console.log(advSug.length)
          }
          {advSug.length > 0 ? (
            <div className="col-5">
              <div className="user_add_case_sugg_box2">
                <div className="user_add_case_sugg_box1_title text-center">
                  <p>Advocate Suggestions</p>
                </div>

                {advSug.map((e) => {
                  return (
                    <div className="user_add_case_sugg_box1_cards mt-4">
                      <div className="user_add_case_sugg_box1_img">
                        {console.log(`${IMG_BASE_URL}/${e.profilePic.filename}`)}
                        <img
                          src={`${IMG_BASE_URL}/${e.profilePic.filename}`}
                          className="img-fluid"
                          alt="Profile"
                        />
                      </div>
                      <div className="user_add_case_sugg_box1_details">
                        <p className="user_add_case_sugg_box1_details_head mb-2">
                          {e.name}
                        </p>
                        <p>{e.specialization}</p>
                        <p className="text-end">
                          <Link to={`/user_bookappoinment/${e._id}/${caseId}`}><i class="ri-arrow-right-line"></i></Link>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="col-4">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="user_add_case_sugg_box1">
                      <div className="user_add_case_sugg_box1_title">
                        <p>Advocate Suggestions </p>
                      </div>
                      <div className="user_add_case_sugg_box1_content">
                        <p>
                          Please enter your case details completely to receive
                          the most updated suggestions for advocates. Providing
                          comprehensive information about your case will help us
                          match you with the best legal professionals suited to
                          your specific needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAddCases;
