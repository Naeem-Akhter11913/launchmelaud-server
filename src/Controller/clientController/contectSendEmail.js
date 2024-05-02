const emailMsg = require("../../Models/ClientSchema/emailSchema");
const Company = require("../../Models/Company");
const Job = require("../../Models/Job");
const News = require("../../Models/News");
const userModel = require("../../Models/user_schema");
const { sendEmail } = require("../../sender/emailSend");
const { emailValidator } = require("../../Validator/dataValidation");
const { validator } = require("../../Validator/regxValidation");


const sendContactEmail = async (req, res) => {
    const { senderName, email, subject, message } = req.body;

    try {
        const adminObj = await userModel.findOne({ role: 'Admin' });
        const adminEmail = adminObj.email;
        const adminName = adminObj.name;

        if (!senderName || !email || !subject || !message) {
            return res.status(400).send({
                status: false,
                message: "Please fill in the following fields"
            })
        }


        const emailObj = {
            username: senderName,
            adminName,
            email: adminEmail,
            fileName: 'clientToAdmin.html',
            message,
            subject
        }


        const isSended = await sendEmail(emailObj);

        if (!isSended) {
            return res.status(201).send({
                status: true,
                message: "Query not sended"
            });
        }
        await emailMsg.create({ senderName, email, subject, message });

        res.status(201).send({
            status: true,
            message: "Query sent successfully"
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

const getCompanyDetails = async (req, res) => {
    try {
        // const data = await Company.find({});

        // res.status(200).send({
        //     status: true,
        //     message: "Company data retrieved successfully",
        //     data
        // });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skipIndex = (page - 1) * limit;

        // Fetching data with pagination
        const data = await Company.find({})
            .skip(skipIndex)
            .limit(limit);

        res.status(200).send({
            status: true,
            message: "Company data retrieved successfully",
            data
        });

    } catch (error) {
        res.status(500).send({
            status: true,
            message: error.message,
        })
    }
};

const getSingleCompanyDetails = async (req, res) => {
    const { slug } = req.query;

    try {
        if (!slug) {
            return res.status(404).send({
                status: false,
                message: "Somthing error.."
            });
        }

        const data = await Company.find({ slug });

        res.status(200).send({
            status: true,
            data
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

const getAllJobs = async (req, res) => {
    const { author } = req.query;

    try {
        if (!author) {
            return res.status(404).send({ status: false, message: 'Opps.... somthing error' });
        }

        const allJobs = await Job.find({ author });

        res.status(200).send({ status: true, message: 'all job fetched', data: allJobs });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};
const getAllNews = async (req, res) => {
    const { author } = req.query;

    try {
        if (!author) {
            return res.status(404).send({ status: false, message: 'Opps.... somthing error' });
        }

        const allNews = await News.find({ author });

        res.status(200).send({ status: true, message: 'all news fetched', data: allNews });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

const sendFaqEmail = async (req, res, next) => {
    const { name, email, subject, message } = req.body;



    try {
        const isVAlided = validator("email", email);

        if (!isVAlided.status) {
            return res.status(404).send({
                status: isVAlided.status,
                message: isVAlided.errorMessage
            });
        }

        // const faqEmailObj = {}
        const adminObj = await userModel.findOne({ role: 'Admin' });
        const adminEmail = adminObj.email;
        const adminName = adminObj.name;

        const emailObj = {
            username: name,
            adminName,
            email: adminEmail,
            fileName: 'clientToAdmin.html',
            message,
            subject
        }

        const isSended = await sendEmail(emailObj);

        if (!isSended) {
            return res.status(201).send({
                status: true,
                message: "Query not sended"
            });
        }

        await emailMsg.create({ senderName: name, email, subject, message });

        res.status(201).send({
            status: true,
            message: "Query sent successfully"
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

module.exports = {
    sendContactEmail,
    getCompanyDetails,
    getSingleCompanyDetails,
    getAllJobs,
    getAllNews,
    sendFaqEmail
}