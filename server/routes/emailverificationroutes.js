const express = require("express");
const { sendemail, verifyemail } = require("../controller/emailverification");

const router = express.Router();

router.post("/sendemail",sendemail);
router.post("/verifyemail",verifyemail);

module.exports = router;