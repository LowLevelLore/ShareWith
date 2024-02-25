var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  res.json({ test: "VALUE" });
});

module.exports = router;
