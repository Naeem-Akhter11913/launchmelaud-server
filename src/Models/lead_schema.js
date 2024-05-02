const { default: mongoose } = require("mongoose");

const leadSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }

},
    {
        timestamps: true,
        versionKey: false
    }
);

const leadModel = new mongoose.model("lead", leadSchema);

module.exports = leadModel;