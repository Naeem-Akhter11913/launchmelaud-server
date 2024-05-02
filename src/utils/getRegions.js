const axios = require('axios');

const LoginRegion = async () => {
    const config = {
        Headers: {
            'Access-Control-Allow-Origin': 'http://localhost'
        }
    }
    const getuserHistory = await axios.get('https://ipapi.co/json',config)
    return getuserHistory.data
};

module.exports = LoginRegion;