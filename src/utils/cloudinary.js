const axios = require('axios');
const FormData = require('form-data');

const imageUpload = async () => {
    const formData = new FormData();

    formData.append('file', image, 'image.jpg');
    formData.append('upload_preset', 'your_upload_preset');

    const data = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData, {
        headers: {
            ...formData.getHeaders(), // Include FormData headers
            'Authorization': 'Bearer your_api_key'
        }
    })
    
};

module.exports = { imageUpload }