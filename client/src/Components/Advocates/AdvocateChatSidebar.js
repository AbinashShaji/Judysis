import React, { useEffect, useState } from "react";
import "../../Styles/AdvocateChatSidebar.css";
import img from "../../Assets/lawimg3.avif";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { ViewById } from "../Services/CommonServices";

function AdvocateChatSidebar() {
  const [users, setUsers] = useState([]);

  const id = localStorage.getItem("advocate");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ViewById('viewChatRecipientsforAdvocateById', id); 
        console.log(result);
  
        if (result.success) {
          console.log(result);
          setUsers(result.user || null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
      }
    };
  
    fetchData();
  }, [id]); 



  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-12">
           

            {users?.length == 0  ? (
              <div className="adv_chat_sidebar_no_recipient">
                <p>No Recipient found</p>
              </div>
            ) : (
              <div className="mt-5" >
                {users?.length
                  ? users.map((e) => {
                      return (
                        <div className="adv_chat_sidebar_name">
                          <Link to={`/advocate_single_chat/${e._id}`}>
                            <div className="d-flex">
                              <div className="adv_chat_sidebar_name_img">
                                <img
                                  src={`${IMG_BASE_URL}/${e.profilePic.filename}`}
                                  className="img-fluid"
                                  alt="Advocate"
                                />
                              </div>
                              <div className="adv_chat_sidebar_name_content px-3">
                                <div>
                                  <p>
                                    <b>{e.name}</b>
                                  </p>
                                
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  : ""}
                
               
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvocateChatSidebar;
