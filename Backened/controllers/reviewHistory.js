const historyReview = require("../modals/Review");

const getAllReviews = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const reviews = await historyReview.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch review history"
        });
    }
};

const getSpecificReview = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const review = await historyReview.findOne({ _id: req.params.id, userId });

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
            message: "Failed to fetch review details"
        });
    }
};

const deleteOneReview = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const review = await historyReview.findOneAndDelete({ _id: req.params.id, userId });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or not authorized to delete"
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