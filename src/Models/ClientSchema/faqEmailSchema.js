const { default: mongoose } = require("mongoose");

const emailMsgSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }

}, { timestamps: true, versionKey: false });

const faqEmail= mongoose.model('faqEmail', emailMsgSchema);

module.exports = faqEmail;