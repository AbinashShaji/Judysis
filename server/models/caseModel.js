const mongoose = require("mongoose");

const caseSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    title: {
        type: String,
        required: true,
    },
    judgeId:{
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'judges'
    },
    judgeStatus:{
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    dateOfIncident: {
        type: Date,
        required: true,

    },
    opponentName: {
        type: String

    },
    opponentAddress: {
        type: String

    },
    location: {
        type: String,
        required: true,
    }, evidence: {
        type: Object
    },
    approvalStatus: {
        type: Boolean,
        default: false
    },
    caseStatus: {
        type: String,
        default: 'new'
    },
    advocateStatus: {
        type: Boolean,
        default: false
    },
    advocateId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'advocates'

    },
    paymentRequested: {
        type: Number,
        default: 0
    },
    paymentCollected: {
        type: Number,
        default: 0
    },

});
module.exports = mongoose.model("cases", caseSchema);
