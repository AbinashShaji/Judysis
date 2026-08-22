import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Services/BaseURLMain'
import { useNavigate } from 'react-router-dom';


function AdminViewJudjes() {
      const navigate = useNavigate();
    
      useEffect(() => {
        if (localStorage.getItem("admin") == null) {
          navigate("/");
        }
      }, [navigate]);
    
    
    const[data,setData]=useState([])

    useEffect(()=>{
        axiosInstance.post(`viewActiveJudges`)
        .then((result)=>{
            console.log(result);
            setData(result.data.data)
            
        })
        .catch((error)=>{
            console.log(error);
            
        })
    },[])
  return (
    <div className="main-div">

      {data.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header fw-bold">Name</th>
                <th className="table-header fw-bold">Email</th>
                <th className="table-header fw-bold">Contact</th>
                <th className="table-header fw-bold">Experience</th>
                <th className="table-header fw-bold">Specialization</th>
              </tr>
            </thead>
            <tbody>
              {data?.length ? (
                data?.map((advocate) => (
                  <tr>
                  <td className="table-data">{advocate?.name}</td>
                    <td className="table-data">{advocate.email}</td>
                    <td className="table-data">{advocate.contact}</td>
                    <td className="table-data">{advocate.experience}</td>
                    <td className="table-data">{advocate.specialization}</td> 
                    {/* <td className="table-data">
                      <Link to={`/admin_view_single_case/${advocate._id}`}>
                        <button className="btn btn-outline-secondary">
                          Details
                        </button>
                      </Link>
                    </td> */}
                    {" "}
                    {/* <td className="table-data">
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
                    </td> */}
                  </tr>
                 ))
              ) : (
                <h1>No Data obtained</h1>
              )} 
            </tbody>
          </table>
        </div>
     ) : (
        <div className="no_cases">
          <h2>No judges</h2>
        </div>
      )} 
      
    </div>
  )
}

export default AdminViewJudjes