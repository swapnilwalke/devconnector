const express = require("express");

const router = express.Router();
//test
// @route GET /api/users/test
// @desc Tests users routes
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users are working" }));

module.exports = router;
