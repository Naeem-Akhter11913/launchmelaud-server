const express = require('express');
const { addCompany, addNews, addJob, getAllJob, getNews, getCompanyDetails, deleteOneJon, getSingleJob, jobUpdate, getPaginationNews, deleteOneNews, getSingleNews, handleUpdate, addCompanyImage } = require('../Controller/company_details_controller');
const { checkSessions } = require('../middleware/middleware');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

// const upload = multer({ dest: 'images/' })


const route = express.Router();

route.post('/addCompany', checkSessions, addCompany);
route.post('/addCompanyImage', checkSessions, upload.single('image'), addCompanyImage);
route.get('/get-company-data', checkSessions, getCompanyDetails);

route.post('/addNews', checkSessions, upload.single('image'), addNews);

// route.post('/addNews', checkSessions, uploadStorage.single("file"), addNews);

route.get('/get-News', checkSessions, getNews);
route.get('/get-single-news', checkSessions, getSingleNews);
route.delete('/del-one-news', checkSessions, deleteOneNews);
route.get('/get-pagi-News', checkSessions, getPaginationNews);

route.put('/update-news', checkSessions, upload.single('image'), handleUpdate);


route.post('/addJobs', checkSessions, addJob);
route.get('/single-job', checkSessions, getSingleJob);

route.get('/get-all-Jobs', checkSessions, getAllJob);
route.delete('/delete-one-Jobs', checkSessions, deleteOneJon);
route.put('/update-Jobs', checkSessions, jobUpdate);

module.exports = route;  