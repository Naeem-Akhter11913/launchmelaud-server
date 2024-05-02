const express = require("express");
const router = express.Router();

/* controller function */
const {
  addProject,
  updateProject,
  getUserProject,
  basicUpdate,
  getProjectDetails,
  thankuEdit,
  submissionUpdatate,
  emailUpdate,
  notificationUpdate,
  translateUpdate,
  blockUpdate,
  deleteProject,
  getProject,
  thankYouImage,
  emailImageUpdate,
  emailSettingsSendEmail
} = require("../Controller/project_controller");
const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage });


// project integration //
const {
  integrate,
  updateIntegration,
  getAllEmbededFormData,
  upgradeleaderboard
} = require("../Controller/integration");

// project submission
const {
  saveSubmission,
  getSubmission,
  deleteSubmission,
  getAllSubmissions,
  getOneWeekData,
  OneWeekData,
  emailValidation,
  bulkEmailValidation,
  emailOTPverificationSubmission,
  getLeaderBoardPreviewData
} = require("../Controller/submission");
const { checkSessions } = require("../middleware/middleware");



/* router test */
router.get("/", async (req, res) => {
  res.status(200).send("Testing open project route successful");
});

/* user add */
router.post("/add-project", checkSessions, addProject);

/* user get */
router.post("/get-user-project", checkSessions, getUserProject);

/* user update */
router.patch("/eidt-project", checkSessions, updateProject);

// get project details
router.get('/project-details/:id', checkSessions, getProjectDetails);

router.get('/getAllProject/:userId', checkSessions, getProject);

// edit project basic details

router.put('/basics-edit', checkSessions, basicUpdate);

router.put('/thank-your-edit', checkSessions, thankuEdit);

// router.put('/thank-your-edit-image',   checkSessions ,upload.single('image') , thankYouImage);

router.put('/thank-your-edit-image', upload.single('image'), thankYouImage);


/* Email Update*/
router.put('/email-edit', checkSessions, emailUpdate);

router.put('/email-image-edit', checkSessions, upload.single('image'), emailImageUpdate);
router.post('/test_send_email_settings', checkSessions, emailSettingsSendEmail);

router.put('/notification-edit', checkSessions, notificationUpdate);

router.put('/translate-edit', checkSessions, translateUpdate);

router.put('/block-edit', checkSessions, blockUpdate);

router.put('/delete-project/:id', checkSessions, deleteProject); 

// project integration //
router.post('/project-integration/:projectId', checkSessions, integrate); 

router.put('/project-update-integration', checkSessions, updateIntegration);

router.get('/get-all-project', getAllEmbededFormData);

// here 

router.put('/laderboard-update', checkSessions, upgradeleaderboard);


// project submission 

// router.post('/submission', checkSessions, saveSubmission);
router.post('/submission', saveSubmission);
router.put('/save-submission-otp-veryfication', emailOTPverificationSubmission);
router.get('/get-all-submissions/:projectId', checkSessions, getSubmission);
router.delete('/delete-submissions/:subsId', checkSessions, deleteSubmission);
// router.get('/getAll-submissions/:userId', checkSessions, getAllSubmissions);
router.get('/getAll-submissions', checkSessions, getAllSubmissions);
router.put('/submission-edit', checkSessions, submissionUpdatate);
router.get('/embeded-preview-submission', getLeaderBoardPreviewData);

// get one week projects
router.get('/getOneWeek-submissions/:userId', checkSessions, getOneWeekData);
router.get('/oneWeek', checkSessions, OneWeekData);

// email validation
router.put('/validate-email', checkSessions, emailValidation);
router.put('/bulk-email-validate', checkSessions, bulkEmailValidation);





module.exports = router;
 