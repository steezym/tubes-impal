const express = require("express");
const router = express.Router();
const auth = require("../Controllers/authController");

router.post("/forgot", auth.forgotPassword);
router.post("/reset", auth.resetPassword);

module.exports = router;
