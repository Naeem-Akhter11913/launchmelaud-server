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

const emailMsg = mongoose.model('emailMsg', emailMsgSchema);

module.exports = emailMsg;