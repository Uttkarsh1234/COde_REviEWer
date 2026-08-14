const aiService = require('../services/aiServices');
const Review = require("../modals/Review");
const { reviewSchema } = require("../validators/validate");

exports.reviewCode = async (req, res) => {
    try {
        const validation = reviewSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: validation.error.issues
            });
        }

        const { language, code } = validation.data;

        const result = await aiService.reviewCode(code, language);
        const review = await Review.create({
            userId: req.user.userId || req.user.id,
            code,
            language,
            output: result
        });

        res.status(200).json({
            success: true,
            result,
            review: {
                _id: review._id,
                language: review.language,
                code: review.code,
                createdAt: review.createdAt
            }
        });
    } catch (error) {
        console.error("Review controller error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to review code"
        });
    }
};