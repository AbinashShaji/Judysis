/**
 * ============================================================================
 * CONTROLLER: chatController.js
 * HANDOVER SUMMARY:
 * This controller powers the real-time direct messaging system in JudiSys.
 * It allows citizens to safely consult and exchange case updates with their assigned lawyers.
 * It records the message text, tracks sender/recipient identities, groups conversation
 * histories, and populates the chat sidebars.
 * ============================================================================
 */

const chat = require("../models/chatSchema");

/**
 * FUNCTION: chatting
 * PURPOSE: Saves a newly sent chat message into the MongoDB database.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Clicking 'Send' in AdvocateChatBox.js or UserChattoAdvocate.js.
 * - Endpoint: POST /judisys_api/chatting
 * - If this data changes: The message is saved with a timestamp and immediately appended
 *   to the visible message bubbles in the active conversation window.
 */
const chatting = async (req, res) => {
  // Step 1: Create a new message document capturing sender, recipient, case link, and text.
  const message = new chat({
    msg: req.body.msg,
    from: req.body.from,
    to: req.body.to,
    advId: req.body.advId,
    userId: req.body.userId,
    internId: req.body.internId,
    jrId: req.body.jrId,
    caseId: req.body.caseId,
    date: new Date()
  });

  // Step 2: Save the message in MongoDB.
  await message
    .save()
    .then((data) => {
      res.json({
        status: 200,
        msg: "Inserted successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatRecipientsforAdvocateById
 * PURPOSE: Finds all unique citizens (clients) who have open chat threads with this lawyer.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load in AdvocateChatSidebar.js.
 * - Endpoint: POST /judisys_api/viewChatRecipientsforAdvocateById/:id
 * - If this data changes: Renders the contact list on the lawyer's chat sidebar so they
 *   can click on a client's name to open their message thread.
 */
const viewChatRecipientsforAdvocateById = (req, res) => {
  chat
    .find({ advId: req.params.id })
    .populate("userId")
    .exec()
    .then((data) => {
      if (data.length > 0) {
        let users = [];
        // Extract citizen profiles from message logs
        data.map((x) => {
          if (x.userId) {
            users.push(x.userId);
          }
        });
        
        // Remove duplicate clients so each person appears only once in the sidebar
        if (users.length > 0)
          users = [...new Set(users)];

        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: users,
        });
      } else {
        res.json({
          status: 200,
          msg: "No Data obtained ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatRecipientsforUserId
 * PURPOSE: Finds all unique lawyers with whom a citizen currently has active chat threads.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load in the citizen chat view (UserChattoAdvocate.js).
 * - Endpoint: POST /judisys_api/viewChatRecipientsforUserId/:id
 * - If this data changes: Renders the list of lawyers in the citizen's chat sidebar.
 */
const viewChatRecipientsforUserId = (req, res) => {
  chat
    .find({ userId: req.params.id })
    .populate("advId")
    .exec()
    .then((data) => {
      if (data.length > 0) {
        let adv = [];
        data.map((x) => {
          adv.push(x.advId);
        });
        // Remove duplicate lawyer profiles
        const uniqueAdvs = [...new Set(adv)];
        res.json({
          status: 200,
          msg: "Data obtained successfully",
          data: uniqueAdvs,
        });
      } else {
        res.json({
          status: 200,
          msg: "No Data obtained ",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not Inserted",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatBetweenUserAndAdv
 * PURPOSE: Retrieves the full chronological message exchange between one citizen and one lawyer.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Selecting a contact in UserChattoAdvocate.js or AdvocateChatBox.js.
 * - Endpoint: POST /judisys_api/viewChatBetweenUserAndAdv
 * - If this data changes: Feeds the message bubbles in the active chat view, sorted by date (oldest to newest).
 */
const viewChatBetweenUserAndAdv = (req, res) => {
  let advId = req.body.advId;
  let userId = req.body.userId;

  chat
    .find({ advId: advId, userId: userId })
    .sort({ date: 1 })
    .populate('advId')
    .populate('userId')
    .exec()
    .then((data) => {
      res.status(200).json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatBetweenAdvAndJr
 * PURPOSE: Retrieves message history between a senior advocate and a junior advocate.
 */
const viewChatBetweenAdvAndJr = (req, res) => {
  let advId = req.body.advId;
  let jrId = req.body.jrId;

  chat
    .find({ advId: advId, jrId: jrId })
    .sort({ date: 1 })
    .populate('jrId')
    .populate('advId')
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatBetweenInternAndAdv
 * PURPOSE: Retrieves message history between a law intern and their supervising advocate.
 */
const viewChatBetweenInternAndAdv = (req, res) => {
  let advId = req.body.advId;
  let internId = req.body.internId;

  chat
    .find({ advId: advId, internId: internId })
    .sort({ date: 1 })
    .populate('internId')
    .populate('advId')
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

/**
 * FUNCTION: viewChatBetweenUserAndJunior
 * PURPOSE: Retrieves message history between a citizen and an assisting junior advocate.
 */
const viewChatBetweenUserAndJunior = (req, res) => {
  let jrId = req.body.jrId;
  let userId = req.body.userId;

  chat
    .find({ userId: userId, jrId: jrId })
    .sort({ date: 1 })
    .populate('jrId')
    .populate('userId')
    .exec()
    .then((data) => {
      res.json({
        status: 200,
        msg: "got it successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

/**
 * FUNCTION: checkIfJrInchat
 * PURPOSE: Checks whether a junior advocate has participated in messages regarding a specific case.
 */
const checkIfJrInchat = (req, res) => {
  let userId = req.body.userId;
  let caseId = req.body.caseId;
  let arr = [];

  chat
    .find({ userId: userId, caseId: caseId })
    .sort({ date: 1 })
    .populate('jrId')
    .populate('userId')
    .exec()
    .then((data) => {
      data.map(x => {
        if (x.from == "jradvocate" && x.to == "user")
          arr.push(x);
        if (x.from == "user" && x.to == "jradvocate")
          arr.push(x);
      });
      res.json({
        status: 200,
        msg: "got it successfully",
        data: arr,
      });
    })
    .catch((err) => {
      res.json({
        status: 500,
        msg: "Data not obtained",
        Error: err,
      });
    });
};

module.exports = {
  chatting,
  viewChatRecipientsforAdvocateById,
  viewChatRecipientsforUserId,
  viewChatBetweenUserAndAdv,
  viewChatBetweenAdvAndJr,
  viewChatBetweenInternAndAdv,
  viewChatBetweenUserAndJunior,
  checkIfJrInchat
};
