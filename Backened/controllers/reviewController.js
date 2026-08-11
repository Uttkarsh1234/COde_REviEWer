const aiService = require('../services/aiServices');
const Review = require("../modals/Review");
const { reviewSchema } = require("../validators/validate");


exports.reviewCode = async(req,res)=>{
    try{
        const validation = reviewSchema.safeParse(req.body);

        if(!validation.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: validation.error.issues
            });
        }

        const {language,code} = validation.data;

        const result = await aiService.reviewCode(code,language);
        const review = await Review.create({
            // userId: req.user.id,
            code,
            language,
            output: result
        });

        res.status(200).json({
            success: true,
            result
        });
    }catch(error){
        res.status(500).json({
            error: error.message
        });
    }
};