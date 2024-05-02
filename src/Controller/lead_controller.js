/* DB */
const userModel = require("../Models/user_schema");
const projectModel = require("../Models/project_schema");
const leadModel = require("../Models/lead_schema");

/* validation */
const { leadValidator } = require("../Validator/dataValidation");

/* add project lead */
const addProjectLead = async (req, res , next) => {
    try {
        const { projectId, name, email } = req.body;

        const isExist = await projectModel.findOne({ _id: projectId, isDeleted: false });
        if (!isExist) {
            return res.status(404).json({ status: false, data: "User not found" });
        }
 
        const isEmailExist = await leadModel.findOne({ projectId, email});
        if (isEmailExist) {
            return res.status(404).json({ status: false, data: "This email is already registered with this project." });
        }

        const errorData = leadValidator({ projectId, name, email });
        
        if (!errorData.status) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errorMessage: errorData.errorMessage,
            });
        }

        const newLead = await leadModel.create({ projectId, name, email });

        return res.status(200).send({
            status: true,
            message: "Project created sucessfully",
            data: newLead,
        });

    } catch (error) {
        // res.status(500).json({ status: false, message: "Internal server error", data: error.message });
        req.error = error;
        next();
    }
};


/* get wrt project Id */
const getProjectLead = async (req, res , next) => {
    try {
        const { projectId } = req.body;

        const isExist = await projectModel.findOne({ _id: projectId, isDeleted: false });
        if (!isExist) {
            return res.status(404).json({ status: false, data: "User not found" });
        }

        const userAllProject = await leadModel.find({ projectId: projectId });
        return res.status(200).send({
            status: true,
            data: userAllProject
        })

    } catch (error) {
        // res.status(500).json({ status: false, message: "Internal server error", data: error.message });
        req.error = error;
        next();
    }
}

module.exports = {
    addProjectLead,
    getProjectLead,
}