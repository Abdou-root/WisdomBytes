{/* Database otp schema */}

const {Schema, model} = require('mongoose')

const userOtpVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
});

module.exports = model('userOtpVerification', userOtpVerificationSchema)