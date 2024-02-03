const express = require("express");
const router = express.Router();
const { getReview, addReview } = require("../controller/review");
router.get("/", getReview);
router.post("/", addReview);

module.exports = router;
