import React, { useEffect, useState } from "react";
import "../../../Styles/AdminDashboard.css";
import userimg from "../../../Assets/Vector (1).png";
import casesimg from "../../../Assets/Vector (2).png";
import adimg from "../../../Assets/image 19.png";
import complaintimg from "../../../Assets/codiconbriefcase.png";

import { viewCount } from "../../Services/AdminService";
import { toast } from "react-toastify";
function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [advocateCount, setAdvocateCount] = useState(0);
  const [cases, setCases] = useState(0);
  const [complaints, setComplaints] = useState(0);
  const [feeds, setFeeds] = useState(0);

 
   
    const fetchdata = async () => {
      try {
          const result = await viewCount('viewAdvocates');
  
          if (result.success) {
              console.log(result);
              if(result.user.length>0)
                setAdvocateCount(result.user);
            else
            setAdvocateCount([])
          } else {
              console.error('View Error :', result);
              toast.error(result.message);
          }
      } catch (error) {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred ');
      }
  };

  const fetchuserdata = async () => {
    try {
        const result = await viewCount('viewAllUsers');

        if (result.success) {
            console.log(result);
            if(result.user.length>0)
              setUserCount(result.user);
          else
          setAdvocateCount([])
        } else {
            console.error('View Error :', result);
            toast.error(result.message);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred ');
    }
};
const fetchCasedata = async () => {
  try {
      const result = await viewCount('getAllCases');

      if (result.success) {
          console.log(result);
          if(result.user.length>0)
            setCases(result.user);
        else
        setAdvocateCount([])
      } else {
          console.error('View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
  }
};
const fetchFeedback= async () => {
  try {
      const result = await viewCount('getAllFeedbacks');

      if (result.success) {
          console.log(result);
          if(result.user.length>0)
            setFeeds(result.user);
        else
        setAdvocateCount([])
      } else {
          console.error('View Error :', result);
          toast.error(result.message);
      }
  } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred ');
  }
};
    useEffect(() => {
    
    fetchdata();
    fetchuserdata()
    fetchCasedata()  
    }, []);
 

  return (
 
      <div className="container">
        {/* <label className="main-label container">Dashboard</label> */}
        <div className="row dashboard-adjust mt-5">
          <div className="col-12 col-sm-6 col-md-3 mb-4 adjust-box">
            <div className="dashbord-box">
              <img className="image-adjust" src={userimg} />
              <div className="text-container">
                <label className="count-label">{userCount.length}</label>
                <label className="content-label">Users</label>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="dashbord-box">
              <img className="image-adjust" src={casesimg} />
              <div className="text-container">
                <label className="count-label">{cases.length}</label>
                <label className="content-label">Cases</label>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="dashbord-box">
              <img className="image-adjust" src={adimg} />
              <div className="text-container">
                <label className="count-label">{advocateCount.length}</label>
                <label className="content-label">Advocates</label>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="dashbord-box">
              <img className="image-adjust" src={complaintimg} />
              <div className="text-container">
                <label className="count-label">{feeds.length}</label>
                <label className="content-label">Feedback</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default AdminDashboard;