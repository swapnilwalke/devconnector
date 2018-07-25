const express = require("express");

const router = express.Router();

// @route GET /api/profiles/test
// @desc Tests profiles routes
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Profiles are working" }));

module.exports = router;
