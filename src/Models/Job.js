const { default: mongoose } = require("mongoose");

const jobSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    title: {
        type: String,
        required: true
    }, // added
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

    mode: {
        type: String,
        enum: ['On site', 'Remote', 'Hybrid'],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },

    experience: {
        type: Number,
        required: true
    }
}, { timestamps: true, versionKey: false });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

