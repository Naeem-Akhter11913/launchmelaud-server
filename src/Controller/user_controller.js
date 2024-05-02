/* DB */
const userModel = require("../Models/user_schema");

/* validation */
const {
    userValidator,
    userUpdationValidator,
    emailValidator,
    passwordValidator
} = require("../Validator/dataValidation");

/* supporting function */
const {
    CreateHashedPassword,
    ComparehashedPassword,
} = require("./support functions/passwordHashing");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { sendEmail, sendActivationEmail } = require("../sender/emailSend");;
const LoginRegion = require("../utils/getRegions");
const { reCaptchaVerify } = require("../utils/recaptcha");
const secreteKey = process.env.SECRET_KEY
const baseURL = process.env.BASE_URL



/* create */
const createRegistration = async (req, res, next) => {
    const { name, email, password, rc_token, plan } = req.body;


    try {


        const message = await reCaptchaVerify(rc_token);

        if (message) {
            return res.status(400).send({
                status: 400,
                message: message,
            })
        }

        const errorData = userValidator({
            name,
            email,
            password
        });

        if (errorData && !errorData.status) {

            return res.status(400).json({
                status: false,
                message: errorData.errorMessage
            });
        }


        const isExist = await userModel.findOne({ email });

        if (isExist) {
            return res.status(400).send({ message: "Email is already registered" });
        }

        const hashedPasswords = await CreateHashedPassword(password);
        // const country = await LoginRegion();
        // console.log(country);

        newRegisteredUser = await userModel.create({ name, email, password: hashedPasswords, country: "India", plan });
        const payload = {
            _id: newRegisteredUser._id,
            name: newRegisteredUser.name,
        }


        const jsonString = JSON.stringify(payload);

        const base64Encoded = Buffer.from(jsonString).toString('base64');

        const link = `${baseURL}/active/account/${base64Encoded}`

        // await sendEmail(email, "Activate Your Account", link);

        const data = {
            fileName: "activeAccount.html",
            link,
            email,
            name: newRegisteredUser.name
        }

        await sendActivationEmail(data);

        const adminObj = await userModel.findOne({ role: "Admin" });
        const adminData = {
            fileName: "toAdmin.html",
            email: adminObj.email,
            adminName: adminObj.name,

            username: name,
            userEmail: email
        }

        await sendEmail(adminData);
        // await sendEmail();


        res.status(201).send({
            status: true,
            message: "Please check your email to activate your account",
        });



    } catch (error) {
        req.error = error;
        next();
    }
};

const registerAndLoginViaGoogle = async (req, res, next) => {
    const { credentials, plan } = req.body;

    try {
        const base64Url = credentials.split('.')[1];
        const decodedValue = JSON.parse(atob(base64Url));
        const country = await LoginRegion();

        const { name, email } = decodedValue;
        const isExist = await userModel.findOne({ email });

        if (isExist) {
            return res.status(400).send({ status: false, message: "Email is already registered" });
        }


        let newRegisteredUser = await userModel.create({ name, email, country: country.country_name, plan, isActive: true, isSs: true });

        const payload = {
            _id: newRegisteredUser._id,
            email: newRegisteredUser.email,
            name: newRegisteredUser.name,
            isSs: newRegisteredUser.isSs,
            userType: newRegisteredUser.role,
        }

        const token = jwt.sign(payload, secreteKey, { expiresIn: '1d' });

        res.cookie('token', token, {
            maxAge: 300 * 100000,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            signed: true,
        });

        res.status(200).send({
            status: 200,
            message: "Logged in successfully",
            token: token,
            data: newRegisteredUser,
        });
    } catch (error) {
        req.error = error;
        next();
    }
};

/* read */
const getAllUsers = async (req, res, next) => {
    const { pageSize, page } = req.query
    try {
        const pageNumber = page ? parseInt(page) : 1;
        const limit = pageSize ? parseInt(pageSize) : 10;
        const skip = (pageNumber - 1) * limit

        const totalCount = await userModel.countDocuments({ role: "Subs", isDeleted: false });

        const allUsers = await userModel.find({ role: "Subs", isDeleted: false })
            .skip(skip)
            .limit(pageSize);


        return res.status(200).send({
            status: true,
            message: "Users fetched successfully",
            data: allUsers,
            totalUser: totalCount
        });

    } catch (error) {
        req.error = error;
        next();
    }
};

/* update + delete*/
const updateUserData = async (req, res, next) => {
    try {
        const { userId, name, password } = req.body;

        const isExist = await userModel.findOne({ _id: userId, isDeleted: false });
        if (!isExist) {
            return res.status(404).json({ status: false, data: "User not found" });
        }

        const errorData = userUpdationValidator({ userId, name, password });
        if (!errorData.status) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errorMessage: errorData.errorMessage,
            });
        }

        let hashedPasswords;
        if (password) {
            hashedPasswords = await CreateHashedPassword(password);
        }

        const updatedData = await userModel.findByIdAndUpdate({ _id: userId }, { userId, name, password: hashedPasswords }, { isNew: true });

        return res.status(200).send({
            status: true,
            message: "user updated successfully",
            data: updatedData
        })


    } catch (error) {
        // res.status(500).json({ status: false, message: "Internal server error", data: error.message });
        req.error = error;
        next()
    }
}

const Login = async (req, res, next) => {
    const { email, password, credentials, rc_token } = req.body;
    try {
        if (email && password) {

            const message = await reCaptchaVerify(rc_token);

            if (message) {
                return res.status(400).send({
                    status: 400,
                    message: message,
                })
            }

            const isExist = await userModel.findOne({ email });

            if (!isExist && isExist?.isDeleted) {
                return res.status(400).send({
                    status: 400,
                    message: "User does not exist",
                });
            }

            if (isExist) {
                const DBpassword = isExist.password;
                const isMatch = await ComparehashedPassword(password, DBpassword)

                // checking password is matched or not
                if (isMatch) {

                    // checking user is Active or not            
                    if (isExist.isActive) {
                        const payload = {
                            _id: isExist._id,
                            email: isExist.email,
                            name: isExist.name,
                            isSs: isExist.isSs,
                            userType: isExist.role,
                        }

                        const token = jwt.sign(payload, secreteKey, { expiresIn: '1d' });

                        res.cookie('token', token, {
                            maxAge: 300 * 100000,
                            httpOnly: true,
                            secure: true,
                            sameSite: 'None',
                            // SameSite: Strict,
                            path: '/',
                            signed: true,
                        });

                        res.status(200).send({
                            status: 200,
                            message: "Logged in successfully",
                            token: token,
                            data: isMatch,
                        });
                    } else {
                        return res.status(400).send({
                            status: 400,
                            message: "please active your account first",
                        });
                    }

                } else {
                    return res.status(400).send({
                        status: 400,
                        message: "Password mismatch"
                    });
                }
            } else {
                return res.status(404).send({ status: false, message: "User does not Exist" });
            }


        } else {
            const base64Url = credentials.split('.')[1];
            const decodedValue = JSON.parse(atob(base64Url));

            const { email } = decodedValue;

            try {


                const isExist = await userModel.findOne({ email });

                if (isExist?.isDeleted) {
                    return res.status(400).send({
                        status: 400,
                        message: "User does not exist",
                    })
                }

                if (isExist) {
                    const payload = {
                        _id: isExist._id,
                        email: isExist.email,
                        name: isExist.name,
                        isSs: isExist.isSs,
                        userType: isExist.role,
                    }

                    const token = jwt.sign(payload, secreteKey, { expiresIn: '1d' });

                    res.cookie('token', token, {
                        maxAge: 300 * 100000,
                        httpOnly: true,
                        path: '/',
                        secure: true,
                        sameSite: 'None',
                        signed: true,
                    });

                    res.status(200).send({
                        status: 200,
                        message: "Logged in successfully",
                        token: token,
                        data: isExist,
                    });

                } else {
                    return res.status(400).send({
                        status: 400,
                        message: "Email not found",
                    });
                }


            } catch (error) {
                res.status(400).json({ status: 400, message: error.message });
            }

        }
    } catch (error) {
        req.error = error;
        next()
    }
}


const logout = (req, res, next) => {

    try {
        res.cookie('token', '', {
            maxAge: 0,
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'None',
            signed: true,
        });

        res.status(200).send({
            status: true,
            message: 'Logged out successfully',
        });

    } catch (error) {
        req.error = error;
        next();
    }
}


const activeUserAccount = async (req, res, next) => {

    const { token } = req.body;

    try {

        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        const jsonObject = JSON.parse(decodedToken);

        const userData = await userModel.findOne({ _id: jsonObject._id });
        const updatedData = {
            isActive: true,
        }
        const newData = await userModel.findOneAndUpdate({ _id: userData._id }, updatedData, { new: true });

        res.status(200).send({
            status: 200,
            message: "Your account has been successfully Activated",
            data: newData
        })

    } catch (error) {
        req.error = error;
        next()
    }
}

const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const errorData = emailValidator(
            email
        );

        if (errorData && errorData.status) {
            return res.status(400).json({
                status: false,
                message: errorData.errorMessage
            });
        }

        const isExist = await userModel.findOne({ email: email });


        if (isExist && isExist.isSs !== true) {
            const payload = {
                _id: isExist._id,
            }


            const jsonString = JSON.stringify(payload);

            const base64Encoded = Buffer.from(jsonString).toString('base64');

            const link = `${baseURL}/account/reset-password/${base64Encoded}`


            const data = {
                fileName: "resetPassword.html",
                email: isExist.email,
                link: link,
                name: isExist.name
            }
            const isSended = await sendEmail(data);

            if (!isSended) {
                return res.status(200).send({
                    status: false,
                    message: "Opps... somthing error",
                });
            }

            res.status(200).send({
                status: 200,
                message: "Check your email to reset your password",
            });
        } else {
            res.status(404).send({
                status: 404,
                message: "you have no account or you have registered Social account",
            });

        }
    } catch (error) {
        req.error = error;
        next();
    }
}

const resetPassword = async (req, res, next) => {
    const { password, token } = req.body;

    try {
        const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
        const jsonObject = JSON.parse(decodedToken);

        const errorData = passwordValidator({
            password,
        });


        if (errorData && !errorData.status) {
            return res.status(400).json({
                status: false,
                message: errorData.errorMessage
            });
        }

        const hashedPasswords = await CreateHashedPassword(password);
        const pass = {
            password: hashedPasswords
        }


        const isUpdated = await userModel.findByIdAndUpdate({ _id: jsonObject._id }, pass, { new: true });

        if (!isUpdated) {
            return res.status(400).send({
                status: false,
                message: "Your password is not updated ",
            });
        }

        res.status(200).send({
            status: 200,
            message: "Your password has been updated successfully",
        });

    } catch (error) {
        req.error = error;
        next();
    }
}

const updateProfile = async (req, res, next) => {
    const { name, password } = req.body;

    const id = new mongoose.Types.ObjectId(req.userObj._id);

    try {
        if (password) {
            const errorData = passwordValidator({
                password,
            });

            if (errorData && !errorData.status) {
                return res.status(400).json({
                    status: false,
                    message: errorData.errorMessage
                });
            }

            const hashedPasswords = await CreateHashedPassword(password);

            const profileObj = {
                name,
                password: hashedPasswords
            }

            // semd
            const datata = await userModel.findByIdAndUpdate({ _id: id }, profileObj, { new: true });

            res.status(200).send({
                status: 200,
                message: 'your proifle is updated successfully'
            });

        } else {
            const profileObj = {
                name,
            }

            const datata = await userModel.findByIdAndUpdate({ _id: id }, profileObj, { new: true });

            res.status(200).send({
                status: 200,
                message: 'your proifle is updated successfully'
            });
        }
    } catch (error) {
        req.error = error;
        next();
    }
}

const deleteUserAccount = async (req, res, next) => {

    const userObj = req.userObj;
    const id = new mongoose.Types.ObjectId(userObj._id)

    try {
        await userModel.findOneAndDelete({ _id: id });

        res.status(200).send({
            status: 200,
            message: 'your proifle is deleted successfully',
        });

    } catch (error) {
        req.error = error;
        next();
    }
}

const getAllUsersForAdmin = async (req, res, next) => {
    try {
        const data = await userModel.find({ role: { $ne: 'Admin' } });

        // Get the current date
        const currentDate = new Date();

        // Calculate the start date for one week ago
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const aggregationPipeline = [
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo, $lt: currentDate },
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

        const AggData = await userModel.aggregate(aggregationPipeline)

        res.status(200).send({
            status: true,
            message: "data successfully retrieved",
            data: data,
            AggData
        });

    } catch (error) {
        // res.status(404).send({
        //     status: false,
        //     message: error.message
        // });
        req.error = error;
        next();
    }
}

const verifyUser = async (req, res, next) => {
    const user = req.userObj;
    try {
        const userData = await userModel.findOne({ email: user.email });
        res.status(200).send({
            status: true,
            message: "User successfully verified",
            data: userData
        });
    } catch (error) {
        req.error = error;
        next();
    }

};

module.exports = {
    createRegistration,
    getAllUsers,
    updateUserData,
    Login,
    activeUserAccount,
    forgetPassword,
    resetPassword,
    updateProfile,
    deleteUserAccount,
    getAllUsersForAdmin,
    logout,
    verifyUser,
    registerAndLoginViaGoogle,

}
