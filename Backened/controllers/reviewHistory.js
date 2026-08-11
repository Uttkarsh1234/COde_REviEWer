const historyReview = require("../modals/Review");

const getAllReviews = async (req, res) => {
    try {
        const reviews = await historyReview.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

const getSpecificReview = async (req, res) => {
    try {
        const review = await historyReview.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong in service"
        });
    }
};

const deleteOneReview = async (req, res) => {
    try {
        const review = await historyReview.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete review"
        });
    }
};

module.exports = {
    getAllReviews,
    getSpecificReview,
    deleteOneReview
};