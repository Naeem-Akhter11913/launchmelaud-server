const Company = require("../Models/Company");
const Job = require("../Models/Job");
const News = require("../Models/News");
const mongoose = require('mongoose');
const slugString = require("../utils/slugGenerator");


const cloudinary = require('cloudinary').v2;


// company details
const addCompany = async (req, res, next) => {
    const { utherId, projectId } = req.query;
    const user = req.userObj;

    const {
        c_name,
        c_tag,
        c_details,
        c_Register,
        f_date,
        c_t_size,
        street,
        country,
        city,
        state,
        website,
        zip,
        tag,
        linkedIn,
        facebook,
        twitter,
        image,
        categories,
        video
    } = req.body;
    
         

    try {
        const isExists = await Company.findOne({ author: user._id });
        const slugStr =  await slugString(c_name)


        if (isExists) { 

            const obj = {
                projectId,
                companyName: c_name,
                tagLine: c_tag,
                comapnyDetails: c_details,
                registrationNumber: c_Register,
                founded: f_date,
                teamSize: c_t_size,
                address: {
                    street,
                    country,
                    state,
                    city,
                    zip
                },
                website,
                categories,
                socialMediaURLs: {
                    linkedIn,
                    twitter,
                    facebook,
                },
                video,
                tags: tag,
                slug: slugStr
            }

            await Company.findOneAndUpdate({ author: user._id }, obj);

            res.status(200).send({
                status: true,
                message: "Company updated successfully"
            })
        } else {
            await Company.create({
                author: user._id,
                projectId,
                companyName: c_name,
                tagLine: c_tag,
                comapnyDetails: c_details,
                registrationNumber: c_Register,
                founded: f_date,
                teamSize: c_t_size,
                address: {
                    street,
                    country,
                    state,
                    city,
                    zip
                },
                website,
                categories,
                socialMediaURLs: {
                    linkedIn,
                    twitter,
                    facebook,
                },
                video,
                profileLogo: image,
                tags: tag,
                slug: slugStr
            });

            res.status(200).send({
                status: true,
                message: "Company aadded successfully"
            })
        }
    } catch (error) {
        req.error = error;
        next();
    }
};

const addCompanyImage = async (req, res, next) => {
    const user = req.userObj;
    try {

        const urls = await cloudinary.uploader.upload(req.file.path, function (err, result) {

            if (err) {
                return "error"
            }

            return result.secure_url
        });

        const obj = {
            profileLogo: urls.secure_url
        }


        await Company.findOneAndUpdate({ author: user._id }, obj);

        res.status(200).send({
            status: true,
            message: "image updated successfully"
        });
    } catch (error) {
        req.error = error;
        next();
    }
};

const getCompanyDetails = async (req, res, next) => {
    const { utherId } = req.query;

    const userObj = req.userObj;

    try {
        const data = await Company.find({ author: userObj._id });

        res.status(200).send({
            status: true,
            message: "Company data retrieved successfully",
            data
        });

    } catch (error) {
        // res.status(500).send({
        //     status: true,
        //     message: error.message,
        // })
        req.error = error;
        next();
    }
};

// job details
const addJob = async (req, res, next) => {

    const userObj = req.userObj;


    const {
        projectId,
        jobTitle,
        companyName,
        jobLocation,
        jobMode,
        salary,
        experience
    } = req.body;


    try {

        await Job.create({
            author: userObj._id,
            projectId,
            title: jobTitle,
            company: companyName,
            location: jobLocation,
            mode: jobMode,
            salary,
            experience
        });

        res.status(201).send({
            status: true,
            message: "Job Added Successfully"
        });
    } catch (error) {
        // res.status(404).send({
        //     status: true,
        //     message: error.message
        // });
        req.error = error;
        next();
    }
};

const deleteOneJon = async (req, res, next) => {
    const { jobId } = req.query;
    try {
        await Job.findOneAndDelete({ _id: jobId });

        res.status(200).send({
            status: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next();
    }

}

const getAllJob = async (req, res, next) => {
    const { page, pageSize } = req.query;


    try {

        const userObj = req.userObj;

        const pageNumber = page ? parseInt(page) : 0;
        const limit = pageSize ? parseInt(pageSize) : 5;
        const skip = Math.max(((pageNumber + 1) - 1) * limit, 0);

        const totalCount = await Job.countDocuments({ author: userObj._id });


        const allData = await Job.find({ author: userObj._id }).skip(skip).limit(limit);

        res.status(200).send({
            status: true,
            data: allData,
            length: totalCount
        });

    } catch (error) {

        // res.status(500).send({
        //     status: true,
        //     message: error.message
        // });

        req.error = error;
        next();
    }
};

const getSingleJob = async (req, res, next) => {
    const { jobId } = req.query;


    try {
        const oneJob = await Job.find({ _id: jobId });

        res.status(200).send({
            status: true,
            message: "Signle Job fetched",
            singleJob: oneJob
        })
    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });

        req.error = error;
        next();
    }
}

const jobUpdate = async (req, res, next) => {
    const {
        jobId,
        companyName,
        experience,
        jobLocation,
        jobMode,
        jobTitle,
        salary
    } = req.body;

    try {

        if (!jobId) {
            return res.status(500).send({ status: false, message: "oops.... somthing is wrong" });
        }

        const updateObj = {
            title: jobTitle,
            company: companyName,
            location: jobLocation,
            mode: jobMode,
            salary,
            experience
        }

        await Job.findOneAndUpdate({ _id: jobId }, updateObj);

        res.status(200).send({
            status: true,
            message: "Job Updated SuccessFully"
        })
    } catch (error) {
        // res.status(500).send({
        //     status: 500,
        //     message: error.message
        // });
        req.error = error;
        next();
    }

};

// mews details
const addNews = async (req, res, next) => {
    const { utherId, projectId } = req.query;

    const userObj = req.userObj;
    const {
        jobHeadLine,
        jobDisc,
    } = req.body;

    try {

        if (!userObj._id) {
            return res.status(404).send({
                status: false,
                message: "oops.... somthing is wrong"
            });
        }


        const urls = await cloudinary.uploader.upload(req.file.path, function (err, result) {

            if (err) {
                return "error"
            }

            return result.secure_url
        });
        

        await News.create({
            projectId,
            author: userObj._id,
            headline: jobHeadLine,
            descriptions: jobDisc,
            image: urls.secure_url
        });

        res.status(201).send({
            status: true,
            message: "News Added SuccessFully",
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

const getNews = async (req, res, next) => {
    const { projectId, utherId } = req.query;
    const userObj = req.userObj;
    try {
        const data = await News.find({ author: userObj._id });

        res.status(200).send({
            status: true,
            message: "News retrieved Successfully",
            data
        });
    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next();
    }
}

const deleteOneNews = async (req, res, next) => {
    const { jobId } = req.query;
    try {
        await News.findOneAndDelete({ _id: jobId });

        res.status(200).send({
            status: true,
            message: "News deleted successfully",
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

const getSingleNews = async (req, res, next) => {

    const { jobId } = req.query;

    try {

        const oneNews = await News.find({ _id: jobId });

        res.status(200).send({
            status: true,
            message: "Signle News fetched",
            singleJob: oneNews
        });

    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // });

        req.error = error;
        next();
    }
}

const getPaginationNews = async (req, res, next) => {
    const { page, pageSize } = req.query;
    const userObj = req.userObj;

    try {
        const author = new mongoose.Types.ObjectId(userObj._id);

        const pageNumber = page ? parseInt(page) : 0;
        const limit = pageSize ? parseInt(pageSize) : 5;
        const skip = Math.max(((pageNumber + 1) - 1) * limit, 0);


        const totalNewsCount = await News.countDocuments({ author: userObj._id });


        const allNewsData = await News.find({ author }).skip(skip).limit(limit);

        res.status(200).send({
            status: true,
            data: allNewsData,
            length: totalNewsCount,
            message: "Pagination News has been successfully retrieved"
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

const handleUpdate = async (req, res, next) => {
    const { jobDisc, jobHeadLine, imageURL, image, author, jobId } = req.body;

    try {
        if (!jobId) {
            return res.status(404).send({
                status: false,
                message: "oops somthing error"
            });
        }

        let urls = null;
        if (!imageURL) {
            urls = await cloudinary.uploader.upload(req.file.path, function (err, result) {

                if (err) {
                    return "error"
                }

                return result.secure_url
            });
        }

        const obj = {
            headline: jobHeadLine,
            descriptions: jobDisc,
            image: urls ? urls.secure_url : imageURL
            // image: urls.secure_url
        }

        await News.findOneAndUpdate({ _id: jobId }, obj);

        res.status(200).send({
            status: true,
            message: "News has been successfully updated",
        });

    } catch (error) {
        // res.status(500).send({
        //     status: false,
        //     message: error.message
        // })
        req.error = error;
        next();
    }
}

module.exports = {
    addCompany,
    addJob,
    addNews,
    getAllJob,
    getNews,
    getCompanyDetails,
    deleteOneJon,
    getSingleJob,
    jobUpdate,
    getPaginationNews,
    deleteOneNews,
    getSingleNews,
    handleUpdate,
    addCompanyImage
}
