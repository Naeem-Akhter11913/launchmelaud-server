const express = require("express");
const { emptyFieldsPercents } = require("../Controller/userFilledPercentage_controller");
const { checkSessions } = require("../middleware/middleware");
const router = express.Router();

router.get('/filled-percentage', checkSessions , emptyFieldsPercents)

module.exports = router;