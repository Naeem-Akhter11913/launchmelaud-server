const integration = require('../Models/integration');

const integrate = async (req, res, next) => {
    const user = req.userObj;
    const { projectId } = req.params;

    try {
        const data = await integration.findOne({ projectId });

        if (!data) {

            const createdData = await integration.create({ projectId, userId: user._id });

            res.status(200).send({
                status: true,
                data: createdData,
                message: 'updated successfully',
            });
        } else {
            res.status(200).send({
                status: true,
                message: 'already present',
            })
        }
    } catch (error) {
        req.error = error;
        next();
    }
};

const updateIntegration = async (req, res, next) => {
    const user = req.userObj;
    const {
        projectId,
        rounded_corner,
        form_position,
        items_alignment,
        font_size,
        border_width,
        email_placeholder,
        collect_name,
        input_border_color,
        input_background_color,
        input_text_color,
        input_placeholder_color,
        btn_text,
        btn_color,
        btn_border_color,
        btn_text_color,
        head_code
    } = req.body;

    const updateData = {
        embeded_form: {
            rounded_corner,
            form_position,
            items_alignment,
            font_size,
            border_width,
            email_placeholder,
            collect_name,
            input_border_color,
            input_background_color,
            input_text_color,
            input_placeholder_color,
            btn_text,
            btn_color,
            btn_border_color,
            btn_text_color,
            head_code
        }
    }

    try {

        const data = await integration.findOne({ projectId });

        if (data) {
            await integration.findOneAndUpdate({ _id: data._id }, updateData);

            res.status(200).send({
                status: true,
                message: 'update Success',
            })
        } else {
            res.status(500).send({
                status: false,
                message: "Opps... somehting is missing"
            });
        }

    } catch (error) {
        req.error = error;
        next();
    }
}

const getAllEmbededFormData = async (req, res, next) => {
    const { projectId } = req.query;

    try {
        if (!projectId) {
            return res.status(400).send({
                status: false,
                message: 'Opps... somehting is missing',
            });
        }

        const data = await integration.find({ projectId });
        res.status(200).send({
            status: true,
            message: 'form data successfully retrieved',
            data: data 
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

const upgradeleaderboard = async (req, res, next) => {
    const {
        projectId,
        types,
        show_titles,
        title,
        sub_title,
        user_limit,
        hdr_bckgrund_color,
        hdr_txt_clr,
        odd_row_bckgrnd_clr,
        odd_row_txt_clr,
        even_row_bckgrnd_clr,
        even_row_txt_clr,
        show_referral_count,
        show_name

    } = req.body;

    const saveChangesObj = {
        leader_board: {
            types,
            show_titles,
            title,
            sub_title,
            user_limit,
            hdr_bckgrund_color,
            hdr_txt_clr,
            odd_row_bckgrnd_clr,
            odd_row_txt_clr,
            even_row_bckgrnd_clr,
            even_row_txt_clr,
            show_referral_count,
            show_name
        }
    }

    try {
        if (projectId) {
            const data = await integration.findOne({ projectId });

            if (data) {
                await integration.findOneAndUpdate({ _id: data._id }, saveChangesObj)
                res.status(200).send({
                    status: true,
                    message: 'successfully updated leaderboard',
                })
            } else {
                res.status(500).send({
                    status: false,
                    message: "Opps... some technical isssue"
                });
            }
        } else {
            res.status(500).send({
                status: false,
                message: "Opps... somehting is missing"
            });
        }
    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next();
    }
};

module.exports = {
    integrate,
    updateIntegration,
    getAllEmbededFormData,
    upgradeleaderboard
}