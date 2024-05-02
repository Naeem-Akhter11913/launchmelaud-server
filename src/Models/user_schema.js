const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        default: "Subs",
        enum: ['Admin', 'Subs']
    },
    password: {
        type: String,
        default: null
    },
    country: {
        type: String,
        required: true,
        default: null
    },
    plan: {
        type: String,
        required: false,
        default: null
    },
    referrals: {
        type: Number,
        required: true, 
        default: 0,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isSs: {
        type: Boolean,
        required: true,
        default: false,
    },
    ownEmail: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, versionKey: false });

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
