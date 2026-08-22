import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css'
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
function COViewUsers() {

    const [data,setData]=useState([])
  
  const fetchdata = async () => {
    try {
        const result = await viewCount('viewAllUsers');

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
{/* <h3 className="admin-user-req-link"><Link to='/admin-userreqs' className="admin-user-req-linkh3" >Registered Users</Link></h3> */}
    
      {data.length !== 0 ? (
        <>
        <h3 className="mt-5 mb-3">Users</h3>
        <div className="table-container table-striped">
          
          <table className="table-change container-fluid">
          <thead className="thead-dark">
                            <tr >
                                <th className="table-header fw-bolder">Name</th>
                                <th className="table-header  fw-bolder">Email</th>
                                <th className="table-header  fw-bolder">Contact</th>
                                <th className="table-header  fw-bolder">Aadhar Number</th>
                                <th className="table-header  fw-bolder">City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((user) => (
                                    <tr>
                                        <td className="table-data">{user.name}</td>
                                        <td className="table-data">{user.email}</td>
                                        <td className="table-data">{user.contact}</td>
                                        <td className="table-data">{user.aadhar}</td>
                                        <td className="table-data"> {user.city}</td>
                                       
                   
                  </tr>
                ))
              ) : (
                <h1>No Data obtained</h1>
              )}
            </tbody>
          </table>
        </div>
        </>
      ) : (
        <div className="no_data_animation">
          <Lottie animationData={noData} className="no_data_animation" />
          
        </div>
      )}
      
    </div>
  )
}

export default COViewUsers
