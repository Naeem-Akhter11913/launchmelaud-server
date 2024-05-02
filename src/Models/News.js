const { default: mongoose } = require("mongoose");

const newsSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },

    headline: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },

}, { timestamps: true, versionKey: false });

const News = mongoose.model('News', newsSchema);
module.exports = News;