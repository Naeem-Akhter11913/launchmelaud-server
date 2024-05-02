const submission = require('../Models/submissions');
const projectModel = require("../Models/project_schema");
// const { emailValidator } = require('../Validator/dataValidation');
const { sendEmail, test_send_email_settings } = require('../sender/emailSend');
const axios = require('axios');
const LoginRegion = require('../utils/getRegions');
const userModel = require('../Models/user_schema');
const { generateUniqueOTP } = require('../utils/generateOTP');
const { validator } = require('../Validator/regxValidation');
const { reCaptchaVerify } = require('../utils/recaptcha');

const API_KEY = "63559387bcb84cf4a0e7ce7446a8b920&email"


const XMLAPI_KEY = 'at_fpaMzAfQxqqDpnUjwlUylhQJgExyf';

const saveSubmission = async (req, res, next) => {

    // const countryObj = await LoginRegion()

    const {
        projectId,
        formName,
        formEmail,
        isChecked,
        ref,
        isEmailValid,
        autherId,
        rc_token
    } = req.body;

    try {

        const message = await reCaptchaVerify(rc_token);

        if (message) {
            return res.status(400).send({
                status: 400,
                message: message,
            })
        }

        const isValidEmail = validator("email", formEmail)

        if (!isValidEmail.status) {
            return res.status(400).send({
                status: "false",
                message: isValidEmail.errorMessage
            })
        }


        const subObj = {
            userId: autherId,
            projectId,
            formName,
            formEmail,
            refBy: ref === undefined ? null : ref,
            logINCountry: "India",
            isEmailValid: false
        }

        const data = await submission.findOne({ formName, formEmail });
        const user = await userModel.findOne({ _id: autherId });
        const project = await projectModel.findOne({ _id: projectId });

        if (!data) {
            // const adminObj = await userModel.findOne({ role: 'Admin' });
            const createdData = await submission.create(subObj);

            const date = new Date(createdData.createdAt);
            const timestamp = date.getTime();


            const updateData = await submission.findOneAndUpdate({
                _id: createdData._id
            },
                { ref: timestamp },
                { new: true }
            );
            const data = {
                fileName: "subsReport.html",
                email: user.email,
                honorName: user.name,
                name: formName,
                // email: adminObj.email
            }

            // generate unique otp

            if (user.ownEmail) {
                const dynamicemailDetails = {
                    reply_to_name: project.email_settings.reply_to_name,
                    reply_to_email: project.email_settings.reply_to_email,
                    send_email_from: project.email_settings.send_email_from,
                    send_email_password: project.email_settings.send_email_password,
                    send_email_host: project.email_settings.send_email_host,
                    send_email_port: project.email_settings.send_email_port,
                    fileName: "subsReport.html",
                }
                await test_send_email_settings(dynamicemailDetails);
            } else {
                await sendEmail(data);
            }


            let OTP = null;
            if (isChecked) {

                OTP = generateUniqueOTP();

                const otp = {
                    fileName: "OTP.html",
                    otp: OTP,
                    email: formEmail
                }
                await sendEmail(otp);
            }

            return res.status(201).send({
                status: true,
                message: 'Submission successfully created',
                data: updateData,
                OTP
            });

        } else {
            return res.status(500).send({
                status: false,
                message: 'You have already submitted a submission',
            });
        }

    } catch (error) {
        req.error = error;
        next();
    }
};

const emailOTPverificationSubmission = async (req, res, next) => {

    const {
        otp,
        matchOTP,
        formEmail,
        rc_token
    } = req.body;



    try {

        const message = await reCaptchaVerify(rc_token);

        if (message) {
            return res.status(400).send({
                status: 400,
                message: message,
            })
        }


        if (parseInt(otp) !== matchOTP) {
            return res.status(404).send({
                status: false,
                message: "Invalid OTP"
            });
        }


        const data = await submission.findOne({ formEmail });

        if (!data) {
            return res.status(200).send({
                status: false,
                message: "OOps... something went wrong"
            });
        }

        const updateData = await submission.findOneAndUpdate({
            _id: data._id
        },
            { isEmailValid: true },
            { new: true }
        );

        return res.status(201).send({
            status: true,
            message: 'email successfully veryfied',
            data: updateData
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

const getSubmission = async (req, res, next) => {
    const { projectId } = req.params;
    const { pageSize, page } = req.query

    const userObj = req.userObj
    try {

        if (userObj._id) {

            const pageNumber = page ? parseInt(page) : 1;
            const limit = pageSize ? parseInt(pageSize) : 10;
            const skip = (pageNumber - 1) * limit;


            const totalCount = await submission.countDocuments({ projectId });


            const allData = await submission
                .find({ projectId })
                .skip(skip)
                .limit(limit)

            res.status(200).send({
                status: true,
                message: 'Submission successfully fetched',
                data: allData,
                totalCount
            });
        } else {
            res.status(500).send({
                status: false,
                message: 'Oops.. something wrong'
            });
        }

    } catch (error) {
        req.error = error;
        next();
    }
};

const deleteSubmission = async (req, res, next) => {
    const { subsId } = req.params;

    try {
        await submission.findOneAndDelete({ _id: subsId });
        res.status(200).send({
            status: true,
            message: 'Submission successfully deleted successfully'
        });
    } catch (error) {
        req.error = error;
        next();
    }
}

const getAllSubmissions = async (req, res, next) => {

    const user = req.userObj;

    try {
        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'Opps.... something went wrong'
            });
        }

        const data = await submission.find({ userId: user._id });

        res.status(200).send({
            status: true,
            message: "Submissions successfully",
            data
        });

    } catch (error) {
        req.error = error;
        next();
    }
}

const getOneWeekData = async (req, res, next) => {
    try {

        // Get the current date
        const user = req.userObj;

        // first you have to filter the particular user data then do aggregation in filtered array data

        const currentDate = new Date();

        // Calculate the start date for one week ago
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const aggregationPipeline = [
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo, $lt: currentDate },
                    // Add any additional conditions if needed
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ];

        // Execute the aggregation pipeline
        const data = await submission.aggregate(aggregationPipeline)

        res.status(200).send(({
            status: true,
            message: "One week Data",
            data
        }))


    } catch (error) {
        req.error = error;
        next();
    }
};

const OneWeekData = async (req, res, next) => {

    const user = req.userObj;

    try {
        const project = await projectModel.find({ userId: user._id }).sort({ createdAt: 'desc' });

        let finalData = [];

        if (project.length > 0) {
            for (let i = 0; i < project.length; i++) {
                const projectObj = project[i];
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 6); // 7 days ago

                const subs = await submission.find({
                    userId: user._id,
                    projectId: projectObj._id,
                    createdAt: { $gte: startDate } // Submissions within the last week
                }).sort({ createdAt: 'desc' });

                let obj = { projectName: projectObj.projectTitle };
                let formattedDate = [];
                let countArr = [];

                // Generate an array with all dates from the past week
                for (let j = 0; j < 7; j++) {
                    formattedDate.push(startDate.toISOString().split('T')[0]);
                    startDate.setDate(startDate.getDate() + 1);
                }

                // Initialize countArr with zeros for all dates
                countArr = Array(formattedDate.length).fill(0);

                // Update countArr with actual counts
                subs.forEach(sub => {
                    const index = formattedDate.findIndex(date => date === sub.createdAt.toISOString().split('T')[0]);
                    if (index !== -1) {
                        countArr[index]++;
                    }
                });

                let data = {
                    count: countArr,
                    label: formattedDate
                };

                finalData.push({ ...obj, data });
            }
        }

        res.status(200).send({
            status: true,
            message: "One week Project Data",
            finalData,
        });
    } catch (error) {
        req.error = error;
        next();
    }
};


// check email validation
const emailValidation = async (req, res, next) => {
    const { submsId } = req.query;
    const { email } = req.body;


    try {
        const isExist = await submission.find({ _id: submsId });

        const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`)


        if (isExist) {

            if (!(response.data.deliverability === 'DELIVERABLE')) {
                return res.status(400).send({
                    status: false,
                    message: "invalid email",
                });
            }

            const updateObj = {
                isEmailValid: response.data.deliverability === 'DELIVERABLE' ? true : false,
            };



            await submission.findOneAndUpdate({ _id: submsId }, updateObj);

            res.status(200).send({
                status: true,
                message: "Email Validation Success"
            });
        } else {
            res.status(400).send({
                status: false,
                message: "Oops! Something is wrong",
            });
        }
    } catch (error) {
        req.error = error;
        next();
    }
};

const bulkEmailValidation = async (req, res, next) => {
    const { data } = req.body;

    try {

        for (let i = 0; i < data.length; i++) {

            const response = await axios.get(`https://emailverification.whoisxmlapi.com/api/v3?apiKey=${XMLAPI_KEY}&emailAddress=${data[i].email}`)

            if (response.data.smtpCheck && response.data.dnsCheck) {
                const updateObj = {
                    isEmailValid: true,
                }

                await submission.findOneAndUpdate({ _id: data[i]._id }, updateObj);


                res.status(200).send({
                    status: true,
                    message: "Email Validation Success"
                });
            }
        }

        res.status(200).send({
            status: true,
            message: "successfully get",
            // data
        });
    } catch (error) {
        req.error = error;
        next();
    }
};

const getLeaderBoardPreviewData = async (req, res, next) => {
    const { projectId } = req.query;

    try {
        if (!projectId) {
            return res.status(400).send({
                status: false,
                message: "Oops.... no id project found"
            });
        }

        const data = await submission.find({ projectId });

        if (data.length < 0) {
            req.status(400).send({
                status: false,
                message: "Oops.... no data found"
            });
        }

        res.status(200).send({
            status: true,
            message: "all Project retrived",
            data
        })

    } catch (error) {
        req.error = error;
        next();
    }
};




module.exports = {
    saveSubmission,
    getSubmission,
    deleteSubmission,
    getAllSubmissions,
    getOneWeekData,
    OneWeekData,
    emailValidation,
    bulkEmailValidation,
    emailOTPverificationSubmission,
    getLeaderBoardPreviewData
}