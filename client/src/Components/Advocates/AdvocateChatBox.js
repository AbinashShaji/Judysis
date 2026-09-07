/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: AdvocateChatBox.js
 * Path: client/src/Components/Advocates/AdvocateChatBox.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the active chat window for lawyers (advocates).
 * When a lawyer clicks on a client from their sidebar list, this box opens up.
 * It shows their conversation history (who said what and when) and provides
 * a text input box at the bottom so the lawyer can type and reply in real-time.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Active when the lawyer navigates to `/advocate_chat/:uid`.
 * - Rendering: Appears on the right side of the screen next to `AdvocateChatSidebar`.
 * - Data Journey:
 *   1. Reads the client's ID (`uid`) from the URL parameters.
 *   2. Contacts the backend route `/viewChatBetweenUserAndAdv` to fetch all past messages.
 *   3. Contacts `/viewUserById` to display the client's profile picture and name at the top.
 *   4. Submitting a new message sends it to `/chatting` and appends it to the screen.
 * ==============================================================================
 */

import React, { useEffect, useRef, useState } from "react";
import "../../Styles/AdvocateChatBox.css";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { ViewById, ViewByData, register } from "../Services/CommonServices";

/**
 * AdvocateChatBox Component
 * Manages the message stream, auto-scrolling, and text submission between lawyer and client.
 */
function AdvocateChatBox() {
  // Step 1: Read the selected client's ID from the URL address bar
  const { uid } = useParams();

  // Step 2: Grab the currently logged-in lawyer's ID from the browser's storage
  const aid = localStorage.getItem("advocate");

  // Step 3: Local state storage for chat data
  // Holds all the messages exchanged back and forth
  const [messageList, setMessageList] = useState([]);
  // Holds the client's profile information (name and photo)
  const [userDetalis, setUserDetails] = useState({ 
    profilePic: { filename: "" },
  });
  // Holds whatever text the lawyer is currently typing in the input box
  const [inputValue, setInputValue] = useState("");
  
  // A reference pointer to the chat scroll container for automatic scrolling
  const chatBodyRef = useRef(null);

  /**
   * Effect Hook: Auto-scroll to the newest message
   * Whenever a new message arrives or is sent, scroll the box to the very bottom
   * so the lawyer never has to manually scroll down to read recent text.
   */
  useEffect(() => {
    if (chatBodyRef.current) { 
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);

  /**
   * Effect Hook: Fetch Conversation History
   * Runs whenever the lawyer ID (`aid`) or client ID (`uid`) changes.
   * Calls the database to retrieve all messages exchanged between them.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("in fetchdata");
        
        // Ask the backend for all messages between this lawyer and client
        const result = await ViewByData('viewChatBetweenUserAndAdv', { advId: aid, userId: uid });
        console.log(result);

        if (result.success) {
          // Store the list of messages in state so React displays them
          setMessageList(result.user || []);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred while loading messages');
      }
    };
  
    fetchData(); 
  }, [aid, uid]);

  /**
   * Effect Hook: Fetch Client Details
   * Retrieves the client's name and photo to display in the chat header.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query client info by their unique user ID
        const result = await ViewById('viewUserById', uid); 
        console.log(result);
  
        if (result.success) {
          setUserDetails(result.user || null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred loading client info');
      }
    };
  
    fetchData();
  }, [uid]); 

  /**
   * handleClientSend
   * Sends the typed message to the backend and adds it to the active screen.
   * 
   * @param {Event} e - The form submission event
   */
  const handleClientSend = async (e) => {
    e.preventDefault();

    // Guard: Prevent sending completely empty messages
    if (!inputValue.trim()) return;

    try {
      // Package the message data and post it to the database
      const result = await register({
        msg: inputValue,
        from: "advocates", // Label sender as advocate
        to: "users",       // Label receiver as user
        advId: aid,        // Lawyer ID
        userId: uid,       // Client ID
      }, 'chatting');

      if (result.success) {
        // Clear the typing box
        setInputValue("");
        // Immediately add the new message to the local list so it shows up instantly
        setMessageList((prevMessageList) => [
          ...prevMessageList,
          result.user,
        ]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while sending message');
    }
  };

  return (
    <div>
      <div className="advocate_chat">
        {/* If there is conversation data, show the chat room */}
        {messageList?.length ? (
          <div className="adv_chat_container">
            {/* Header: Displays client's profile picture and full name */}
            <div className="chat-header">
              <img
                src={`${IMG_BASE_URL}/${userDetalis.profilePic.filename}`}
                className="img-fluid"
                alt="Advocate"
              />
              <span className="fs-5 px-3">{userDetalis.name}</span>
            </div>

            {/* Chat Body: The scrollable area showing message bubbles */}
            <div className="adv_chat-body" ref={chatBodyRef}>
              {messageList.map((msg) => (
                <div key={msg._id || msg.id}>
                  {/* Bubble styling: Received messages align left, sent messages align right */}
                  <div
                    className={`chat-message ${
                      msg.from === "users" && msg.to === "advocates"
                        ? "received"
                        : "sent"
                    }`}
                  >
                    <div className="message-header">
                      {/* Show sender's name */}
                      <span className="username">
                        <small>
                          {msg.from === "users"
                            ? msg.userId?.name
                            : msg.advId?.name}
                        </small>
                      </span>
                      {/* Show date timestamp (YYYY-MM-DD) */}
                      <span className="timestamp">
                        {msg.createdAt?.slice(0, 10)}
                      </span>
                    </div>
                    {/* The actual text message */}
                    <p className="message-content">{msg.msg}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Form: Text input field and send button */}
            <form onSubmit={handleClientSend}>
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
          /* Empty placeholder state if no conversation is selected or found */
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

