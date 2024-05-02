const axios = require('axios');

async function addSubscriber(objs, tags) {
    const apiKey = '66e63477a84e8d152d650b7e77d9b964-us13';
    const listId = 'c9b3a47964';

    const data = {
        email_address: objs.EMAIL,
        status: 'subscribed',
        merge_fields: objs,
        TAGS: [tags]
        // Add any other custom fields as needed
    };

    try {
        const response = await axios.post(`https://us13.api.mailchimp.com/3.0/lists/${listId}/members/`, data, {
            auth: {
                username: 'anystring',
                password: apiKey
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error adding subscriber:', error.response.data);
    }
}



module.exports = {addSubscriber}