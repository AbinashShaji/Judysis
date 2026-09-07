/**
 * ============================================================================
 * FILE: dbConnection.js
 * HANDOVER SUMMARY:
 * This file is the bridge between our backend server and the MongoDB database.
 * It opens up the communication channel so that whenever someone registers,
 * files a case, or updates a hearing date, the data can be saved and retrieved.
 * ============================================================================
 */

// Step 1: Bring in 'mongoose', a handy tool that lets Node.js talk smoothly to MongoDB.
const mongoose = require("mongoose");

// Step 2: Tell Mongoose where our database lives.
// '127.0.0.1:27017' is the default local address for MongoDB, and 'judicial' is the name of our database folder.
mongoose.connect("mongodb://127.0.0.1:27017/judicial");

// Step 3: Grab the active connection object so we can listen to its events.
var db = mongoose.connection;

// If something goes wrong with the database connection, print the error in our terminal.
db.on("error", console.error.bind("error"));

// Once the connection is successfully established, print a friendly confirmation message.
db.once("open", function () {
    console.log("connection successful");
});

// Step 4: Share this connection with the rest of our application files.
module.exports = db;