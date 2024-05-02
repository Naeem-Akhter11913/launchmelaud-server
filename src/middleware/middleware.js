const jwt = require('jsonwebtoken');
const secreteKey = '@33fdsf@A'


const checkSessions = async (req, res, next) => {

    const token = req.signedCookies.token;

    try {
        if (!token) {
            return res.status(403).send({
                status: false,
                message: 'cookies is not available',
            });
        }
        const userObj = jwt.verify(token, secreteKey);

        const currentTime = Math.floor(Date.now() / 1000);

        if (userObj.exp < currentTime) {

            return res.status(401).send({
                status: false,
                message: 'Unauthorized: Token has expired',
            });
        }
        
        req.userObj = userObj;
        next();

    } catch (error) {
        return res.status(401).send({
            status: false,
            message: 'Unauthorized: Invalid or expired token',
        });
    }
};

module.exports = { checkSessions };

