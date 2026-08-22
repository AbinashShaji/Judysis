import React, { useEffect, useRef, useState } from "react";
import "../../Styles/UserChatToAdvocate.css";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { register, ViewByData, ViewById } from "../Services/CommonServices";

function UserChattoAdvocate() {
  const uid = localStorage.getItem("user");
  const { aid } = useParams();

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
        const result =await ViewByData('viewChatBetweenUserAndAdv',{ advId: aid, userId: uid });

        if (result.success) {
          console.log(result);
  
            setMessageList(result.user);
  
        } else {
  
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
      }
    };
  
    fetchData(); 
  }, [aid]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await ViewById('viewAdvocateById', aid);
        console.log(result);
  
        if (result.success) {
          console.log(result);
          setUserDetails(result.user || null);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred during login');
      }
    };
  
    fetchData();
  }, [aid]); 

  const handleSend =async (e) => {
    e.preventDefault();

    try {
      const result =await register({
        msg: inputValue,
        from: "users",
        to: "advocates",
        advId: aid,
        userId: uid,
      },'chatting');

      if (result.success) {
        setInputValue('');
        setMessageList(prevMessageList => [...prevMessageList, result.user]);

      } else {

        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
    console.log(inputValue);
 
  };

  console.log(messageList);

  return (
    <div className="user_chat">
      <div className="chat-container">
        <div className="chat-header">
          <img
            src={`${IMG_BASE_URL}/${userDetalis.profilePic.filename}`}
            className="img-fluid chat-image"
            alt="Advocate"
          />

          <span className="fs-5 px-3">{userDetalis.name}</span>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          {messageList.length ? (
            messageList.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.from == "users" ? "sent" : "received"
                }`}
              >
                <div className="message-header">
                  <span className="username">
                    <small>
                      {msg.from == "users" ? msg.userId.name : msg.advId.name}
                    </small>
                  </span>
                  <span className="timestamp">
                    {msg.createdAt.slice(0, 10)}
                  </span>
                </div>
                <p className="message-content">{msg.msg}</p>
              </div>
            ))
          ) : (
            <div className="no_chat_container">
              <h3>
                Please start the conversation and get the help or information
                you need.
              </h3>
            </div>
          )}
        </div>
        <form onSubmit={handleSend} >
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type Your Message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserChattoAdvocate;
