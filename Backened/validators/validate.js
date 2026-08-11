const {z} = require('zod');

const reviewSchema = z.object({
    code : z.string().min(1,"Code is required").max(50000,"Code is too large"),
    language: z.string().min(1, "Language is required").max(30,"Invalid language name").trim()
});

module.exports =  { reviewSchema };