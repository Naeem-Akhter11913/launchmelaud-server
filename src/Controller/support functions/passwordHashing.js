const bcrypt = require('bcryptjs');

const CreateHashedPassword = async (password) => {
    try {
        const salt = 10;
        const hashedPasswords = await bcrypt.hash(password, 10);
        return hashedPasswords;
    } catch (e) {
        return resizeBy.status(400).send({
            status: false,
            message: "Password Hashing Error",
        })
    };
}

const ComparehashedPassword = async (password, DBpassword) => {
    try {
        const isMatchPassword = await bcrypt.compare(password, DBpassword);
        return isMatchPassword;
    } catch (error) {
        return resizeBy.status(400).send({
            status: false,
            message: "Password Matching Error",
        });
    }
};


module.exports = {
    CreateHashedPassword,
    ComparehashedPassword
};