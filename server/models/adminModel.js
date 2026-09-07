/**
 * ============================================================================
 * MODEL: adminModel.js
 * HANDOVER SUMMARY:
 * This database blueprint (schema) stores the login credentials for the central 
 * system administrator. The admin has the highest level of authority in JudiSys, 
 * with permissions to verify lawyers, approve citizens, and monitor the entire court system.
 * 
 * COLLECTION NAME IN MONGODB: 'admins'
 * ============================================================================
 */

const mongoose = require("mongoose");

const Adminschema = mongoose.Schema({
    // The official email address used by the administrator to log into the Admin portal.
    // 'unique: true' prevents two admins from using the exact same email address.
    email: {
        type: String,
        unique: true,
        required: true,
    },
    // The secret password used to verify the administrator's identity.
    password: {
        type: String,
        required: true,
    },
});

// Export this model so 'adminController.js' can find and check administrator accounts.
module.exports = mongoose.model('admin', Adminschema);