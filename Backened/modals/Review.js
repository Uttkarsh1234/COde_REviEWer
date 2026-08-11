const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
        // userId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true
        // },
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required : true
        },
        output: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const review = mongoose.model('ReviewSchema',schema);

module.exports = review;