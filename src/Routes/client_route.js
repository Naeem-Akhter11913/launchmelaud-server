const express = require('express');
const { sendContactEmail, getCompanyDetails, getSingleCompanyDetails, getAllJobs, getAllNews, sendFaqEmail } = require('../Controller/clientController/contectSendEmail');

const route = express.Router();

route.post('/send_client_email',sendContactEmail);
route.post('/send_faq_client_email',sendFaqEmail);
route.get('/company_details',getCompanyDetails);
route.get('/single_company_details',getSingleCompanyDetails);
route.get('/get_all_jobs',getAllJobs);
route.get('/get_all_news',getAllNews);


module.exports = route; 