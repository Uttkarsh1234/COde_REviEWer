const { Language } = require('@google/genai');
const mongoose = require('mongoose');
const schema = new mongoose.Schema(
    {
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