/**
 * ============================================================================
 * FILE: index.js (Main Backend Server Entry Point)
 * HANDOVER SUMMARY:
 * This is the front door of our entire backend application. It sets up the 
 * Express web server, configures helpful helper tools (like reading incoming 
 * form data and allowing browser access), connects our file-upload storage, 
 * and wires up all of our API routes under the '/judisys_api' web address.
 * ============================================================================
 */

// Step 1: Import all the essential building blocks.
// 'express' is our web server framework that listens for clicks and forms from the frontend.
const express = require('express');

// 'body-parser' helps Express translate incoming JSON data and form inputs into easy-to-read Javascript objects.
const bodyParser = require('body-parser');

// Connect to our MongoDB database right when the server powers on.
const db = require('./dbConnection');

// Initialize the Express application.
const app = express();

// 'cors' (Cross-Origin Resource Sharing) permits our React frontend (running on port 3000)
// to talk freely with this backend server (running on port 4048) without security blocks.
const cors = require('cors');

// 'path' is a built-in Node utility to handle file and folder directories safely.
const path = require('path');

// Step 2: Set up server middlewares (the helpers that process every incoming message).
// Allow reading URL-encoded data from HTML forms.
app.use(bodyParser.urlencoded({ extended: false }));

// Allow reading JSON payloads sent from React Axios calls.
app.use(bodyParser.json());

// Make the 'upload' folder public so uploaded case documents, identity proofs, and photos
// can be viewed directly in a browser (e.g., http://localhost:4048/your-uploaded-image.jpg).
app.use(express.static(`${__dirname}/upload`));

// Enable CORS for all incoming requests.
app.use(cors());

// Step 3: Connect all application routes.
// We pull in the master routes file where all our user, advocate, judge, and case endpoints live.
const route = require('./routes');

// Prefix every backend route with '/judisys_api'.
// For example, registering a user becomes: http://localhost:4048/judisys_api/registerUser
// DATA JOURNEY: Any click or form submitted on the React client calls an address starting with
// '/judisys_api', which triggers this router to hand off the request to the right controller.
app.use('/judisys_api', route);

// Step 4: Turn on the server and listen for connections on port 4048.
app.listen(4048, () => {
    console.log("Server created successfully at 4048");
});