const express = require("express");
const router = express.Router();

/* controller function */
const {
    addProjectLead,
    getProjectLead
} = require("../Controller/lead_controller");



/* router test */
router.get("/", async (req, res) => {
    res.status(200).send("Testing open project route successful");
});

/* user add */
router.post("/add-lead", addProjectLead);

/* user get */
router.get("/get-all-project-lead", getProjectLead);

/* user update */
// router.patch("/eidt-lead", );


module.exports = router;