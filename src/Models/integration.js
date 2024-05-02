const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    embeded_form: {
        rounded_corner: {
            type: Number,
            required: false,
            default: 14
        },
        form_position: {
            type: String,
            required: false,
        },
        items_alignment: {
            type: String,
            required: false,
            default: "column",
        },
        font_size: {
            type: String,
            default: '10px',
            required: false,
        },
        border_width: {
            type: String,
            default: '1px',
            required: false,
        },
        email_placeholder: {
            type: String,
            required: false,
            default: 'abcd@gmail.com'
        },
        collect_name: {
            type: Boolean,
            default: true,
            required: false
        },
        input_border_color: {
            type: String,
            default: 'rgb(255, 199, 0)',
            required: false
        },
        input_background_color: {
            type: String,
            default: 'rgb(255, 255, 255)',
            required: false
        },
        input_text_color: {
            type: String,
            default: '#374151',
            required: false
        },
        input_placeholder_color: {
            type: String,
            default: '#999999',
            required: false
        },

        btn_text: {
            type: String,
            default: 'Save',
            required: false
        },

        btn_color: {
            type: String,
            default: 'rgb(255, 255, 255)',
            required: false
        },
        btn_border_color: {
            type: String,
            default: 'rgb(255, 199, 0)',
            required: false
        },
        btn_text_color: {
            type: String,
            default: 'rgb(221, 172, 0)',
            required: false
        },
        head_code: {
            type: String,
            default: '#000000',
            required: false
        }
    },

    leader_board: {
        types: {
            type: String,
            required: false,
            default: "10px"
        },
        show_titles: {
            type: Boolean,
            default: true,
            required: false
        },
        title: {
            type: String,
            required: false,
        },
        sub_title: {
            type: String,
            required: false
        },
        user_limit: {
            type: Number,
            required: false,
        },
        hdr_bckgrund_color: {
            type: String,
            required: false,
            default: 'rgb(255, 255, 255)'
        },
        hdr_txt_clr: {
            type: String,
            required: false,
            default: '#222222'
        },
        odd_row_bckgrnd_clr: {
            type: String,
            required: false,
            default: 'rgb(255, 251, 251)'
        },
        odd_row_txt_clr: {
            type: String,
            required: false,
            default: '#222222'
        },
        even_row_bckgrnd_clr: {
            type: String,
            required: false,
            default: '#222222'
        },
        even_row_txt_clr: {
            type: String,
            required: false,
            default: 'rgb(255, 255, 255)'
        },
        show_referral_count: {
            type: Boolean,
            required: false,
            default: true
        },
        show_name: {
            type: Boolean,
            required: false,
            default: true
        }
    }
}, { timestamps: true, versionKey: false });


const intgretionModel = new mongoose.model("integration", userSchema);

module.exports = intgretionModel;