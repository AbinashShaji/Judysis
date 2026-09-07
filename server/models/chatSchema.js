/**
 * ============================================================================
 * MODEL: chatSchema.js
 * HANDOVER SUMMARY:
 * This database blueprint stores individual chat messages between citizens (litigants) 
 * and advocates (lawyers). It captures who sent the message, who received it, 
 * the text content, the relevant case ID, and the exact timestamp.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - New messages render immediately in the active chat bubble screen (AdvocateChatBox.js and UserChattoAdvocate.js).
 * - Recent conversation partners are listed on the chat sidebar (AdvocateChatSidebar.js).
 * 
 * COLLECTION NAME IN MONGODB: 'chats'
 * ============================================================================
 */

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // The actual text content of the message sent.
    msg: {
      type: String,
      required: true,
    },
    // Sender identifier or role (e.g., 'user', 'advocate').
    from: {
      type: String,
      required: true,
    },
    // Recipient identifier or role.
    to: {
      type: String,
      required: true,
    },
    // Link to the advocate participating in the discussion.
    advId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "advocates"
    },
    // Optional link to the specific legal case being discussed.
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cases"
    },
    // Link to the citizen participating in the discussion.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    // Optional field for legal interns assisting on the case.
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interns'
    },
    // Optional field for junior advocates helping the senior lawyer.
    jrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "junioradvocates",
    },
    // Date and time when the message was sent.
    date: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

// Export model for use by 'chatController.js'
const Message = mongoose.model("chats", messageSchema);
module.exports = Message;
