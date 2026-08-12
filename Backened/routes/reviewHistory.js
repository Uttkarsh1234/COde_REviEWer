const express = require("express");
const {
    getAllReviews,
    getSpecificReview,
    deleteOneReview
} = require("../controllers/reviewHistory");
const authmiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",authmiddleware ,getAllReviews);

router.get("/:id",authmiddleware ,getSpecificReview);

router.delete("/delete/:id", authmiddleware ,deleteOneReview);

module.exports = router;