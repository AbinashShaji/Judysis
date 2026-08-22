import React, { useEffect } from 'react'
import '../Admin/RecentEnquries.css'
import enquiry from '../../Assets/mdi_push-notification-outline.png'
import { useNavigate } from 'react-router-dom';

function RecentEnquries() {

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminId" == null)) {
      navigate("/");
    }
  });

  return (
    <div className='container-fluid'>
        <div className='enquries-div'>
            <div className='enquries-div-1'>
                <img src={enquiry}/>{}
                <label>Recent Enquries</label>
            </div>
            <div className='enquries-div-1'>

            </div>
        </div>
    </div>
  )
}

export default RecentEnquries