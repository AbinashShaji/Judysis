import React, { useEffect, useRef, useState } from "react";
import "../../Styles/AdvocateChatBox.css";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { ViewById,ViewByData,register } from "../Services/CommonServices";

function AdvocateChatBox() {
  const { uid } = useParams();


  const aid = localStorage.getItem("advocate");

  const [messageList, setMessageList] = useState([]);
  const [userDetalis, setUserDetails] = useState({ 
    profilePic: { filename: "" },
  });
  const [inputValue, setInputValue] = useState("");
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) { 
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);




  useEffect(() => {

    const fetchData = async () => {
      try {
        console.log("in fetchdata");
        
        const result =await ViewByData('viewChatBetweenUserAndAdv', { advId: aid, userId: uid });
console.log(result);

        if (result.success) {
          console.log(result);
  
            setMessageList(result.user||[]);
  
        } else {
  
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
      }
    };
  
    fetchData(); 
  }, [aid,uid]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ViewById('viewUserById', uid); 
        console.log(result);
  
        if (result.success) {
          console.log(result);
          setUserDetails(result.user || null);
        } else {
          // toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
      }
    };
  
    fetchData();
  }, [uid]); 



  const handleClientSend =async (e) => {
    e.preventDefault();

    try {
      const result =await register({
        msg: inputValue,
        from: "advocates",
        to: "users",
        advId: aid,

        userId: uid,
      },'chatting');

      if (result.success) {
        setInputValue("");
          setMessageList((prevMessageList) => [
            ...prevMessageList,
            result.user,
          ]);
      } else {

        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
    console.log(inputValue);
 
  };






  return (
    <div>
      <div className="advocate_chat">
        {messageList?.length ? (
          <div className="adv_chat_container">
            <div className="chat-header">
              <img
                src={`${IMG_BASE_URL}/${userDetalis.profilePic.filename}`}
                className="img-fluid"
                alt="Advocate"
              />
              <span className="fs-5 px-3">{userDetalis.name}</span>
            </div>
            <div className="adv_chat-body" ref={chatBodyRef}>
              {console.log(messageList)
              }
              {messageList.map((msg) => (
                <div>
                
                    <div
                      key={msg.id}
                      className={`chat-message ${
                        msg.from == "users" && msg.to == "advocates"
                          ? "received"
                          : "sent"
                      }`}
                    >
                      <div className="message-header">
                        <span className="username">
                          <small>
                            {msg.from == "users"
                              ? msg.userId.name
                              : msg.advId.name}
                          </small>
                        </span>
                        <span className="timestamp">
                          {msg.createdAt.slice(0, 10)}
                        </span>
                      </div>
                      <p className="message-content">{msg.msg}</p>
                    </div>
                 
                </div>
              ))}
            </div>
            <form
              onSubmit={
              
                  handleClientSend
                
              }
            >
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type Your Message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="no_chat_container">
            <h3>
              Please select a person to start a conversation and get the help or
              information you need.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvocateChatBox;
