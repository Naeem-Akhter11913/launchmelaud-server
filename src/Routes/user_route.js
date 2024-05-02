const express = require("express");
const router = express.Router();

/* controller function */
const {
    createRegistration,
    updateUserData,
    getAllUsers,
    Login,
    activeUserAccount,
    forgetPassword,
    resetPassword,
    updateProfile,
    deleteUserAccount,
    getAllUsersForAdmin,
    // getCookies,
    logout,
    verifyUser,
    registerAndLoginViaGoogle
} = require("../Controller/user_controller");

const { checkSessions, session } = require("../middleware/middleware");

/* router test */
// router.get("/", async (req, res , next) => {
//     try {
//         res.status(200).send("Testing open user route successful");

//     } catch (error) {
//         req.error = error;
//         next()
//     }
// });

/* user add */
router.post("/user-registration", createRegistration);

/* user register and login via google */
router.post("/user-register-logging",registerAndLoginViaGoogle); 

/* user get */
router.get("/get-user", getAllUsers);

/* user update */
router.patch("/eidt-user", updateUserData);

/* login user */
router.post("/login-user", Login);

/* Active user */
router.put("/active/account", activeUserAccount);


/* forget password */
router.post("/forget-password", forgetPassword);

/* reset password */
router.put("/reset-password", resetPassword);

/* profile update */
router.put("/update-profile", checkSessions, updateProfile);

/* delete account*/
router.put("/delete-account", checkSessions, deleteUserAccount);


// get all users 
router.get("/get-all-for-admin", checkSessions, getAllUsersForAdmin);


// router.post("/getCookies", getCookies);
router.get('/logout', logout);

// verify user from cookies 
router.get('/verify-user', checkSessions, verifyUser);

module.exports = router;