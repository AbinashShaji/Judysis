/**
 * ============================================================================
 * COMPONENT: AdvocateChat.js (Lawyer Messenger Layout)
 * HANDOVER SUMMARY:
 * This component coordinates the two halves of the lawyer's chat interface:
 * 1. Left Sidebar (<AdvocateChatSidebar />): List of all active client conversations.
 * 2. Right Box (<AdvocateChatBox />): Active message bubbles and message input bar.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: /advocate_chat and /advocate_single_chat/:uid
 * ============================================================================
 */

import React from "react";
import "../../Styles/AdvocateChat.css";
import AdvocateChatSidebar from "./AdvocateChatSidebar";
import AdvocateChatBox from "./AdvocateChatBox";

function AdvocateChat() {
  return (
    <div>
      <div className="container-fluid advocate_main">
        <div className="row">
          <div
            className="col-lg-3 col-md-6 col-sm-12 advocate_chat_sidebar"
            style={{ padding: 0 }}
          >
            <AdvocateChatSidebar />
          </div>
          <div className=" col-lg-9 col-md-6 col-sm-12">
         
              <div className="no_chat_container">
                {/* <h3>
                  Please select a person to start a conversation and get the
                  help or information you need.
                </h3> */}
              </div>
            
              <AdvocateChatBox />
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvocateChat;
