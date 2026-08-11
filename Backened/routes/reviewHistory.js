const express = require("express");
const {
    getAllReviews,
    getSpecificReview,
    deleteOneReview
} = require("../controllers/reviewHistory");

const router = express.Router();

router.get("/", getAllReviews);

router.get("/:id", getSpecificReview);

router.delete("/delete/:id", deleteOneReview);

module.exports = router;