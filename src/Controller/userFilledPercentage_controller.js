const companyModel = require("../Models/Company");
const jobModal = require("../Models/Job");
const projectModal = require("../Models/project_schema");
const newsSchema = require("../Models/News");
const userSchema = require("../Models/user_schema");

const { countEmptyFields, calculateTrueFalsePercentage } = require("../utils/emptyFilled");

const emptyFieldsPercents = async (req, res, next) => {
    const userObj = req.userObj;

    try {
        const companyDetails = await companyModel.findOne({ author: userObj._id });
        const numberOfJobs = await jobModal.find({ author: userObj._id });
        const numberOfProjects = await projectModal.find({ userId: userObj._id });
        const numberOfNews = await newsSchema.findOne({ author: userObj._id });
        const userDetails = await userSchema.findOne({ _id: userObj._id });


        let emptyCompanyCount = false;
        
        if (companyDetails) {
            const isEmpty = countEmptyFields(companyDetails);
            if(isEmpty === 0)emptyCompanyCount = true 
        }

        let totalJobs = false;
        if (numberOfJobs.length > 0) {
            totalJobs = true;
        }

        let createdProject = false;
        if (numberOfProjects && numberOfProjects.length > 0) {
            createdProject = true
        }

        let createdNews = false
        if (numberOfNews) {
            createdNews = true
        }

        let numberOfUserEmptyfields = false
        if (userDetails) {
            if (userDetails.isSs) numberOfUserEmptyfields = true;
            else if(countEmptyFields(userDetails) > 0)
                numberOfUserEmptyfields = false
        }

        const data = {
            emptyCompanyCount,
            totalJobs,
            createdProject,
            createdNews,
            numberOfUserEmptyfields
        }
        const totalFilledPercentage = calculateTrueFalsePercentage(data);
        data.totalFilledPercentage = totalFilledPercentage
        res.status(200).send({
            status: true,
            data
        });


    } catch (error) {
        req.error = error;
        next();
    }
};

module.exports = { emptyFieldsPercents }