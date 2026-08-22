import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css'
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
function AdminViewUsers() {

    const [data,setData]=useState([])
  const handleActivate = async(id) => {
    try {
      const result = await approveById('activateUserById',id);

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
      const result = await approveById('deActivateUserById',id);

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
<h3 className="admin-user-req-link"><Link to='/admin-userreqs' className="admin-user-req-linkh3" >New User Requests</Link></h3>
    
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
                                <th className="table-header  fw-bolder">Profile</th>
                                <th className="table-header  fw-bolder">Action</th>
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
                                        <td className="table-data">
                                            <Link to={`/admin_view_single_user/${user._id}`}>
                                                <button className="btn1 btn btn-outline-secondary p-1">
                                                    <img src={img} alt="View Details" />
                                                </button>
                                            </Link>
                    </td>{" "}
                    {console.log(user.isActive)}
                    <td className="table-data">
                      {user.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size1 p-1"
                          onClick={() => handleDeactivate(user._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size1 p-1"
                          onClick={() => handleActivate(user._id)}
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
        </>
      ) : (
        <div className="no_data_animation">
          {/* <Lottie animationData={noData} className="no_data_animation" /> */}
          <h1 className="text-center">No Users</h1>

        </div>
      )}
      
    </div>
  )
}

export default AdminViewUsers
