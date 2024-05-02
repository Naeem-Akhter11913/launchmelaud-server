const { default: mongoose } = require("mongoose");

const companySchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    companyName: {
        type: String,
        required: false,
    }, 
    tagLine: {
        type: String,
        required: false,
    },
    comapnyDetails: {
        type: String,
        required: false,
    },
    registrationNumber: {
        type: String,
    },
    founded: {
        type: String,
        required: false,
    },

    teamSize: {
        type: Number,
        required: false,
    },
    address: {
        street: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        state: {    
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        zip: {
            type: String,
            required: false,
        },

    },  
    website: {
        type: String,
        required: false,
    },

    categories: {
        type: [String],
        required: false
    },
    
    socialMediaURLs: {
        linkedIn: { type: String, },
        twitter: { type: String, },
        facebook: { type: String, }
    },
    video: {
        type: String,
        required: false,
    },
    profileLogo: {
        type: String,
        required: false,
        default: 'https://res.cloudinary.com/dsk3ibtuu/image/upload/v1711089959/noImagePlaceholder_mdeluk.png'
    },

    tags: {
        type: String,
        required: false
    },
    slug:{
        type: String,
        required: false
    }
}, { timestamps: true, versionKey: false });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;