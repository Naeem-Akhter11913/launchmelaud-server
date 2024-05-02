const { promisify } = require('util');
const request = promisify(require('request'));




async function reCaptchaVerify(rc_token) {
    const response_key = rc_token
    const secret_key = "6Le7cakpAAAAACx2VHeas2yDXSF0NyLcI_31dxST";
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true }
    }

    const re = await request(options);

    if (!JSON.parse(re.body)['success']) {
        return 'Verification failed, please try again'
    }
}

module.exports = { reCaptchaVerify } 