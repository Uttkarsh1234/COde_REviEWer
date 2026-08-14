const mongoose  = require('mongoose');
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
        password: {
            type: String,
            minLength: 5,
            default:null
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        }
    },
    {
        timestamps: true
    }
)

const user = mongoose.model('User',userSchema);
module.exports = user;