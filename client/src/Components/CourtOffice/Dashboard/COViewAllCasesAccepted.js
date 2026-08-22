import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Services/BaseURLMain'
import { Link, useNavigate } from 'react-router-dom';

function COViewAllCasesAccepted() {
      const navigate = useNavigate();
    
      useEffect(() => {
        if (localStorage.getItem("court") == null) {
          navigate("/");
        }
      }, [navigate]);
    
    
    const [data,setData]=useState([])

    useEffect(()=>{
        axiosInstance.post(`/getCasesJudgeAssign`)
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
            <thead className="admin-tab-head">
              <tr>

                <th className="table-header admin-tab-head-text"> SlNo</th>
                <th className="table-header">Title</th>
                <th className="table-header">Description</th>
                <th className="table-header">Case Type</th>
                <th className="table-header">Date of Incident</th>
                <th className="table-header">User Name</th>
                
                <th className="table-header">Advocate Name</th>
                <th className="table-header">Action</th>

              </tr>
            </thead>
            <tbody>
               {data?.length ? (
                data.map((advocate,index) => (
                  <tr key={advocate._id}>
                    <td className="table-data">{index+1}</td>
                     <td className="table-data">{advocate.title}</td>
                    <td className="table-data">{advocate.description}</td>
                    <td className="table-data">{advocate.type}</td>
                    <td className="table-data">{advocate.dateOfIncident.slice(0,10)}</td>
                    <td className="table-data">{advocate.userId.name}</td>
                    <td className="table-data">{advocate.advocateId.name} </td> 
                    
                    <td className="table-data">
                
                        
                      <Link to={`/co_view_AllAcceptedCases_Single/${advocate._id}`}> <button
                          className="btn btn-outline-success button-size w-100"
                        //   onClick={() => redirect(advocate._id)}
                        >
                          View More
                        </button></Link>
                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No Data obtained</td>
                </tr>
              )} 
            </tbody>
          </table>
        </div>
       ) : ( 
        <div className="no_data_animation">
          <h1 className="text-center">No New Requests Found</h1>
        </div>
       )} 
    </div>
  )
}

export default COViewAllCasesAccepted