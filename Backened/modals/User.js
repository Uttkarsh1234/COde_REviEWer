const mongoose  = require('mongoose');
const { maxLength, lowercase, minLength } = require('zod');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 50,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        passowrd: {
            type: String,
            required: true,
            minLength: 5
        }
    },
    {
        timestamps: true
    }
)

const user = mongoose.model('User',userSchema);
module.exports = user;