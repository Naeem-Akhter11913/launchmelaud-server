const { default: mongoose } = require("mongoose");
// const objectId = mongoose.Schema.Types.ObjectId();

const project_Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    projectTitle: {
        type: String,
        required: true,
    },
    projectUrl: {
        type: String,
        required: false,
        default: 'https://res.cloudinary.com/dsk3ibtuu/image/upload/v1711089959/noImagePlaceholder_mdeluk.png'
    },


    signUp_setting: {
        type: Boolean,
        required: true,
        default: false
    },


    tyPage_setting: {
        type: Boolean,
        required: true,
        default: false
    },


    // added Schema thank you page
    Thank_you_page: {
        image: {
            type: String,
            required: false,
            default: 'https://res.cloudinary.com/dsk3ibtuu/image/upload/v1711089959/noImagePlaceholder_mdeluk.png'
        },
        title: {
            type: String,
            required: false,
            default: ''
        },
        Subheading: {
            type: String,
            required: false,
            default: ''
        },
        reward_description: {
            type: String,
            required: false,
            default: ''
        },
        current_position: {
            type: String,
            rrequired: false,
            default: ''
        },
        referred: {
            type: String,
            required: false,
            default: ''
        },
        social_media_message: {
            type: String,
            required: false,
            default: ''
        },
        social: {
            type: [String],
            required: false,
            enum: ['Twitter', 'Facebook', 'WhatsApp', 'LinkedIn', 'Reddit', 'Telegram', 'VK', 'Email'],
            default: []
        },
        background_color: {
            type: String,
            required: false,
            default: '#40E0D0'
        },
        CTA_button_text: {
            type: String,
            required: false,
            default: ''
        },
        CTA_button_url: {
            type: String,
            required: false,
            default: ''
        },
        twiter: {
            type: String,
            required: false,
            default: ''
        },
        instagram: {
            type: String,
            required: false,
            default: ''
        },
        linkedln: {
            type: String,
            required: false,
            default: ''
        },
        facebook: {
            type: String,
            required: false,
            default: ''
        },
        redit: {
            type: String,
            required: false,
            default: ''
        },
        tracking_code: {
            type: String,
            required: false,
            default: ''
        },

        hide_thank_you_page: {
            type: Boolean,
            required: false,
            default: true
        },
        hide_referral: {
            type: Boolean,
            required: false,
            default: true
        },
        hide_success_page: {
            type: Boolean,
            required: false,
            default: true
        },
        hide_powered_by: {
            type: Boolean,
            required: false,
            default: true
        },
    },

    // added Schema submission
    submissions: {
        initial_position: {
            type: String,
            required: false,
            default: ''
        },
        position_to_move: {
            type: Number,
            rrequired: false,
            default: 0
        },
        enable_google: {
            type: Boolean,
            required: false,
            default: true
        },
        auto_validate_email: {
            type: Boolean,
            required: false,
            default: true
        },
        new_submissions: {
            type: Boolean,
            required: false,
            default: true
        },

    },

    // added Schema email setting
    email_settings: {
        image: {
            type: String,
            required: false,
            default: 'https://res.cloudinary.com/dsk3ibtuu/image/upload/v1711089959/noImagePlaceholder_mdeluk.png'
        },

        send_welcome_email: {
            type: Boolean,
            required: false,
            default: true
        },
        welcome_mail_subject: {
            type: String,
            required: false,
            default: ''
        },
        welcome_message: {
            type: String,
            required: false,
            default: ''
        },
        hide_CTA_button: {
            type: Boolean,
            required: false,
            default: true
        },

        send_welcome_mail_verified: {
            type: Boolean,
            required: false,
            default: true
        },
        send_email_verification_mail: {
            type: Boolean,
            required: false,
            default: true
        },
        custom_verification_message: {
            type: String,
            required: false,
            default: ''
        },
        reply_to_name: {
            type: String,
            required: false,
            default: ''
        },
        reply_to_email: {
            type: String,
            required: false,
            default: ''
        },
        send_email_from: {
            type: String,
            required: false,
            default: null
        },
        send_email_password: {
            type: String,
            required: false,
            default: ''
        },
        send_email_host: {
            type: String,
            required: false,
            default: ''
        },
        send_email_port: {
            type: Number,
            required: false,
            default: 465
        }

    },

    // added Schema notification
    notification: {
        enable_notification: {
            type: Boolean,
            required: false,
            default: true,
        },
        emails_frequency: {
            type: String,
            required: false,
            default: 'Once A Day',
        }
    },

    // added Schema translation
    translation: {
        appear_on_emails: {
            type: String,
            required: false,
            default: ''
        },
        thank_you_page_title: {
            type: String,
            required: false,
            default: ''
        },

        verify_email: {
            type: String,
            required: false,
            default: ''
        },
        check_your_position: {
            type: String,
            rrequired: false,
            default: ''
        },

        all_rights_reserved: {
            type: String,
            required: false,
            default: ''
        },
        trouble_clicking_verify_button: {
            type: String,
            required: false,
            default: ''
        },
    },

    // added Schema blocks email
    blocks: {
        block_email_domain: {
            type: Boolean,
            required: false,
            default: false
        },
        referral_IDs: {
            type: String,
            required: false,
            default: ''
        },
        pattern_matching: {
            type: String,
            required: false,
            default: ''
        }
    },


    Signup: {
        headerColor: {
            type: String,
            required: true,
            default: "#000"
        },
        headerTextSize: {
            type: String,
            required: true,
            default: "1rem"
        },
        cardBackGround: {
            type: String,
            required: true,
            default: "#000"
        },
        cardBorder: {
            type: String,
            required: true,
            default: "0px"
        },

    },
    TyPage: {
        headerColor: {
            type: String,
            required: true,
            default: "#000"
        },
        headerTextSize: {
            type: String,
            required: true,
            default: "1rem"
        },
        cardBackGround: {
            type: String,
            required: true,
            default: "#000"
        },
        cardBorder: {
            type: String,
            required: true,
            default: "0px"
        },

    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
}, { timestamps: true, versionKey: false });

const projectModel = new mongoose.model("project", project_Schema);

module.exports = projectModel;