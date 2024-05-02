/* DB */
const userModel = require("../Models/user_schema");
const projectModel = require("../Models/project_schema");
const mongoose = require('mongoose');

/* validation */
const {
    projectValidator,
    projectUpdationValidator
} = require("../Validator/dataValidation");
const { test_send_email_settings } = require("../sender/emailSend");

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'naeemakhter',
    api_key: "748249191417414",
    api_secret: 'UAWi3MfoATTMNy8Xb_bZT_9Z_7s'
});


/* add project */
const addProject = async (req, res, next) => {
    const userData = req.userObj;
    const userId = new mongoose.Types.ObjectId(userData._id)
    try {
        const {
            // userId,
            projectTitle,
            projectUrl,
            signUp_setting,
            tyPage_setting,
            Signup,
            TyPage,
        } = req.body;

        const isExist = await userModel.findOne({ _id: userId, isDeleted: false });

        if (!isExist) {
            return res.status(404).json({
                status: false,
                data: "User not found"
            });
        }

        const isProjectNameExist = await projectModel.findOne({
            userId,
            projectTitle,
            isDeleted: false
        });


        if (isProjectNameExist) {
            return res.status(404).json({
                status: false,
                data: "This project title is already in use.Use different project title.",
            });
        }

        const errorData = projectValidator({
            userId,
            projectTitle,
            Signup,
            TyPage,
            projectUrl
        });

        if (!errorData.status) {
            return res.status(400).json({
                status: false,
                message: errorData.errorMessage,
            });
        }

        const newProject = await projectModel.create({
            userId,
            projectTitle,
            projectUrl,
            signUp_setting,
            tyPage_setting,
            Signup,
            TyPage
        });

        return res.status(200).send({
            status: true,
            message: "Project created sucessfully",
            data: newProject,
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

/* edit + del */
const updateProject = async (req, res, next) => {
    try {
        const {
            projectId,
            userId,
            projectTitle,
            signUp_setting,
            tyPage_setting,
            Signup,
            TyPage,
            isDeleted
        } = req.body;

        const isExist = await projectModel.findOne({ _id: projectId, isDeleted: false });
        if (!isExist) {
            return res.status(404).json({ status: false, data: "Project not found" });
        }
        const errorData = projectUpdationValidator({ userId, projectTitle, Signup, TyPage });

        if (!errorData.status) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errorMessage: errorData.errorMessage,
            });
        }

        const isProjectNameExist = await projectModel.find({ userId: userId, projectTitle: projectTitle, isDeleted: false });

        if (isProjectNameExist) {
            return res.status(404).json({ status: false, data: "This project title is already in use.Use different project title." });
        }

        const updatedProject = await projectModel.findByIdAndUpdate({ _id: isExist._id }, {
            userId, projectTitle, signUp_setting, tyPage_setting, Signup, TyPage, isDeleted
        }, { isNew: true });

        return res.status(200).send({
            status: true,
            message: "Project updated sucessfully",
            data: updatedProject,
        })
    } catch (error) {
        // res.status(500).json({ status: false, message: "Internal server error", data: error.message });
        req.error = error;
        next();
    }
};


/* get wrt user */
const getUserProject = async (req, res) => {
    const { userId } = req.body;

    try {
        const userAllProject = await projectModel.find({ userId: userId, isDeleted: false });
        return res.status(200).send({
            status: true,
            data: userAllProject
        })

    } catch (error) {
        // return res.status(500).json({ status: false, message: "Internal server error", data: error.message });
        req.error = error;
        next();
    }
}

// ---------------------------- [PROJECT UPDATE] --------------------------------- //
const basicUpdate = async (req, res) => {
    const userObj = req.userObj;
    const {
        projectID,
        projectTitle,
        projectUrl
    } = req.body;


    try {
        const idExists = await projectModel.findOne({ userId: userObj._id });

        if (!idExists) {
            return res.status(400).send({
                status: 400,
                message: 'Project Not Exists'
            });
        }
        const updateObj = {
            projectTitle,
            projectUrl
        }

        const updatedData = await projectModel.findOneAndUpdate({ _id: idExists._id }, updateObj, { new: true });

        res.status(200).json({
            status: 200,
            message: "Project Basic Update Successful",
            data: updatedData
        })
    } catch (error) {
        // res.status(500).json({
        //     status: false,
        //     data: error.message
        // });

        req.error = error;
        next();
    }
}


// get project information

const getProjectDetails = async (req, res, next) => {
    const { id } = req.params;

    try {
        const details = await projectModel.findOne({ _id: id });
        if (details) {
            return res.status(200).send({
                status: true,
                message: 'project details',
                data: details
            });
        } else {
            return res.status(500).send({
                status: false,
                message: 'Opps... Project not found'
            });
        }
    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     data: error.message
        // });

        req.error = error;
        next();
    }
}

const thankuEdit = async (req, res) => {
    const {
        projectId,
        image,
        title,
        Subheading,
        reward_description,
        current_position,
        referred,
        social_media_message,
        social,
        background_color,
        CTA_button_text,
        CTA_button_url,
        twiter,
        instagram,
        linkedln,
        facebook,
        redit,
        tracking_code,
        hide_thank_you_page,
        hide_referral,
        hide_success_page,
        hide_powered_by
    } = req.body;


    try {
        const TupdateData = {
            Thank_you_page: {
                image,
                title,
                Subheading,
                reward_description,
                current_position,
                referred,
                social_media_message,
                social,
                background_color,
                CTA_button_text,
                CTA_button_url,
                twiter,
                instagram,
                linkedln,
                facebook,
                redit,
                tracking_code,
                hide_thank_you_page,
                hide_referral,
                hide_success_page,
                hide_powered_by
            }
        }

        const isData = await projectModel.findOne({ _id: projectId })

        if (!isData) {
            return res.status(500).send({
                status: false,
                data: "Project is not present "
            });
        }

        await projectModel.findOneAndUpdate({ _id: projectId }, TupdateData, { new: true })

        res.status(200).json({
            status: true,
            message: "Your thank You section successfully update"
        })

    } catch (error) {
        res.status(500).send({
            status: false,
            data: error.message
        });
    }
}

const thankYouImage = async (req, res) => {
    const { projectId } = req.body;
    try {
        const isData = await projectModel.findOne({ _id: projectId })

        if (!isData) {
            return res.status(500).send({
                status: false,
                data: "Project is not present "
            });
        }
        const urls = await cloudinary.uploader.upload(req.file.path, function (err, result) {

            if (err) {
                return "error"
            }

            return result.secure_url
        });

        // const TupdateData = {
        //     Thank_you_page: {
        //         image: urls.secure_url,
        //     }
        // }
        const TupdateData = {
            'Thank_you_page.image': urls.secure_url
        };

        const isUpdated = await projectModel.findOneAndUpdate({ _id: projectId }, TupdateData, { new: true })

        res.status(200).json({
            status: true,
            message: 'image update succefully',
            image: urls.secure_url
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            data: error.message
        });
    }
}


const submissionUpdatate = async (req, res) => {
    const userObj = req.userObj
    const {
        _id,
        userId,
        initial_position,
        position_to_move,
        enable_google,
        auto_validate_email,
        new_submissions
    } = req.body;


    const submissionObj = {
        submissions: {
            initial_position,
            position_to_move,
            enable_google,
            auto_validate_email,
            new_submissions
        }
    }


    try {
        const data = await projectModel.findOne({ _id: _id, userId: userObj._id });

        if (data) {
            await projectModel.findOneAndUpdate({ _id: data._id }, submissionObj);

            res.status(200).send({
                status: true,
                message: 'Your submission is successfully updated',
            });

        } else {
            res.status(500).send({
                status: false,
                message: 'you no permission to update'
            });
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }

};

const emailUpdate = async (req, res, next) => {

    const {
        _id,
        url,
        send_welcome_email,
        welcome_mail_subject,
        welcome_message,
        hide_CTA_button,
        send_welcome_mail_verified,
        send_email_verification_mail,
        custom_verification_message,
        reply_to_name,
        reply_to_email,
        send_email_from,
        send_email_password,
        send_email_host,
        send_email_port

    } = req.body;


    const emailObj = {
        email_settings: {
            image: url,
            send_welcome_email,
            welcome_mail_subject,
            welcome_message,
            hide_CTA_button,
            send_welcome_mail_verified,
            send_email_verification_mail,
            custom_verification_message,
            reply_to_name,
            reply_to_email,
            send_email_from,
            send_email_password,
            send_email_host,
            send_email_port
        }
    }

    try {
        const data = await projectModel.findOne({ _id: _id });

        if (data) {

            await projectModel.findOneAndUpdate({ _id: _id }, { $set: emailObj });

            const emptyEmailSettings = data.email_settings;

            let numberOfEmptyFields = 0;
            for (const key in emptyEmailSettings) {
                if (emptyEmailSettings[key] === '') {
                    numberOfEmptyFields++;
                }
            }


            res.status(202).send({
                status: true,
                message: "email settings is updated",
                emptyEmail: numberOfEmptyFields
            });

        } else {
            res.status(500).send({
                status: false,
                message: "your your are unknown user",
            });
        }

    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next()
    }
};

const emailImageUpdate = async (req, res) => {
    const { projectId } = req.body;

    try {
        const data = await projectModel.findOne({ _id: projectId });

        if (data) {
            const urls = await cloudinary.uploader.upload(req.file.path, function (err, result) {

                if (err) {
                    return "error"
                }
                return result.secure_url
            });

            const updateData = {
                'email_settings.image': urls.secure_url
            };
            await projectModel.findOneAndUpdate({ _id: projectId }, { $set: updateData });

            res.status(202).send({
                status: true,
                message: "image updated"
            });

        } else {
            res.status(500).send({
                status: false,
                message: "your your are unknown user"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const notificationUpdate = async (req, res) => {
    const userObj = req.userObj

    const {
        _id,
        enable_notification,
        emails_frequency
    } = req.body

    const notificationObj = {
        notification: {
            enable_notification,
            emails_frequency
        }
    }


    try {
        const data = await projectModel.findOne({ _id: _id, userId: userObj._id });


        if (!data) {
            return res.status(500).send({
                status: false,
                message: 'your cant edit project settings'
            });
        }

        const isUpdate = await projectModel.findOneAndUpdate({ _id: data._id }, notificationObj, { new: true });

        if (isUpdate === null) {
            return res.status(400).send({
                status: false,
                message: "unable to update"
            })
        }

        res.status(200).send({
            status: 200,
            message: 'notification updated successfully',
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

const translateUpdate = async (req, res, next) => {
    const userObj = req.userObj

    const {
        _id,
        appear_on_emails,
        thank_you_page_title,
        verify_email,
        check_your_position,
        all_rights_reserved,
        trouble_clicking_verify_button
    } = req.body

    const translateObj = {
        translation: {
            appear_on_emails,
            thank_you_page_title,
            verify_email,
            check_your_position,
            all_rights_reserved,
            trouble_clicking_verify_button
        }
    }

    try {
        const data = await projectModel.findOne({ _id: _id, userId: userObj._id });

        if (!data) {
            return res.status(400).send({
                status: false,
                message: 'you cant update sorry.....'
            });
        }

        const isUpdate = await projectModel.findOneAndUpdate({ _id: _id }, translateObj, { new: true });

        if (!isUpdate) {
            res.status(404).send({
                status: false,
                message: 'you cant update'
            });
        }

        res.status(200).send({
            status: true,
            message: "translate section updated successfully",
            data: isUpdate
        });

    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next();
    }
};

const blockUpdate = async (req, res) => {
    const userObj = req.userObj
    const {
        _id,
        userId,
        block_email_domain,
        referral_IDs,
        pattern_matching
    } = req.body


    const blocksObj = {
        blocks: {
            block_email_domain,
            referral_IDs,
            pattern_matching
        }
    }

    try {
        const data = await projectModel.findOne({ _id: _id, userId: userObj._id });

        if (data) {
            await projectModel.findOneAndUpdate({ _id: _id }, blocksObj);

            res.status(200).send({
                status: true,
                message: "Block updated successfully"
            });

        } else {
            res.status(400).send({
                status: false,
                message: 'you cant update sorry.....'
            });
        }
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        await projectModel.findOneAndDelete({ _id: id });

        res.status(200).send({
            status: true,
            message: "project Deleted Successfully"
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
}


const getProject = async (req, res) => {
    const { userId } = req.params;

    try {
        if (userId) {
            const project = await projectModel.findOne({ userId });
            res.status(200).send({
                status: true,
                data: project
            })
        } else {
            res.status(404).send({
                status: false,
                message: "Somthing Error"
            })
        }
    } catch (error) {
        res.status(404).send({
            status: false,
            message: error.message
        });
    }
}

const emailSettingsSendEmail = async (req, res, next) => {
    const userObj = req.userObj;

    const {
        reply_to_name,
        reply_to_email,
        send_email_from,
        send_email_password,
        send_email_host,
        send_email_port,
        projectId
    } = req.body;

    try {

        const emailObject = {
            reply_to_name,
            reply_to_email,
            send_email_from,
            send_email_password,
            send_email_host,
            send_email_port,
            fileName: 'checkSendEmail.html'
        }

        const isSended = await test_send_email_settings(emailObject)
        if (!isSended) {
            return res.status(400).send({
                status: false,
                message: 'Please give valid credentials'
            });
        }

        await userModel.findOneAndUpdate({ _id: userObj._id }, { ownEmail: true }, { new: true });

        res.status(200).send({
            status: false,
            message: 'email sent successfully'
        });

    } catch (error) {
        req.error = error;
        next();
    }
};


module.exports = {
    addProject,
    updateProject,
    getUserProject,
    basicUpdate,
    getProjectDetails,
    thankuEdit,
    submissionUpdatate,
    emailUpdate,
    notificationUpdate,
    translateUpdate,
    blockUpdate,
    deleteProject,
    getProject,
    thankYouImage,
    emailImageUpdate,
    emailSettingsSendEmail
}
