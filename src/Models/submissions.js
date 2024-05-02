const { default: mongoose } = require("mongoose");

const submissionSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: false, 
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    formName: {
        type: String,
        required: true,
    },
    formEmail: {
        type: String,
        required: true,
    },
    ref:{
        type: Number,
        required: false,
        default:null,
    },
    refBy:{
        type: Number,
        required: false,
        default:null,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    logINCountry:{
        type: String,
        required: true,
        default: false, 
    },
    isEmailValid:{
        type: Boolean,
        enum: [true , false],
        required: true,
        default: false,
    }

},
    {
        timestamps: true,
        versionKey: false
    }
);

const sub = new mongoose.model("submission", submissionSchema);

module.exports = sub;