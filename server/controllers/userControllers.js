{/* User controllers Backend*/}


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')
const User = require('../models/userModel')
const HttpError = require("../models/errorModel")
const userOtpVerification = require("../models/otpVerificationModel")
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');


// Nodemailer to send email verification 
let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})


const sendOtpVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;


        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Email Verification",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup</p>
            <p> This code <b> expires in 1 hour</b></p>`,


        };
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        const newOtpVerification = new userOtpVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOtpVerification.save();

        await transporter.sendMail(mailOptions);

    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message,
        })
    }
}

//============== Register User =============//
// POST: api/users/register
// UNPROTECTED


const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password) {
            return next(new HttpError("Fill in all the fields", 422))
        }

        const newEmail = email.toLowerCase()
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(newEmail)) {
            return next(new HttpError("Invalid Email Format!", 422));
        }

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email Already Exists!", 422));
        }


        if ((password.trim()).length < 8) {
            return next(new HttpError("Password too short", 422))
        }

        if (password != password2) {
            return next(new HttpError("Passwords do not match", 422))
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPassword });

        await sendOtpVerificationEmail(newUser, res);
        res.status(201).json({
            status: "pending",
            message: `New User ${newUser.email} registered`,
            userId: newUser._id.toString(),
        });



    } catch (error) {
        return next(new HttpError("User Registration Failed!", 422));
    }
}


const verifyOTP = async (req, res, next) => {
    try {

        const { otp, userId } = req.body;
        if (!otp || !userId) {
            console.error("OTP or UserId is missing:", { otp, userId });
            return next(new HttpError("Please provide all OTP details", 422))
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid UserId format:", userId);
            return next(new HttpError("Invalid UserId format", 422));
        }
        const objectId = new mongoose.Types.ObjectId(userId);

        const userOtpVerificationRecord = await userOtpVerification.find({ userId: objectId });

        if (userOtpVerificationRecord.length <= 0) {
            // no record
            return next(new HttpError("Account doesn't exist or has already been verified"))
        }
        const { expiresAt } = userOtpVerificationRecord[0];
        const hashedOTP = userOtpVerificationRecord[0].otp;

        if (expiresAt < Date.now()) {
            // expired otp
            await userOtpVerification.deleteMany({ userId: objectId });
            return next(new HttpError("Code expired, please request again!", 422))
        }
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return next(new HttpError("Invalid code entered, try again!", 422));
        }

        await User.updateOne({ _id: objectId }, { verified: true })
        userOtpVerification.deleteMany({ userId: objectId });
        res.json({
            status: "Verified",
            message: "Email verified successfully",
        })
    }

    catch (error) {
        console.error("Error in verifyOTP:", error);
        res.json({
            status: "Failed",
            message: error.message,
        })
    }
}
const resendOTP = async (req, res, next) => {
    try {
        let { userId, email } = req.body;
        if (!userId || !email) {
            return next(new HttpError("Empty user details not allowed", 422))
        }
        await userOtpVerification.deleteMany({ userId });
        sendOtpVerificationEmail({ _id: userId, email }, res);
    } catch (error) {
        res.json({
            status: "Failed",
            message: error.message,
        })
    }
}







//============== Login User =============//
// POST: api/users/login
// UNPROTECTED

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Fill in all fields", 422))
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail })
        if (!user) {
            return next(new HttpError("Invalid credentials", 422))
        }
        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            return next(new HttpError("Passwords do not match", 422))
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie('token', token, {
            httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 // For cross-site cookies
            // Cookie expires in 24 hours
        })
        res.cookie('userId', id, {
            httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 // For cross-site cookies
            // Cookie expires in 24 hours
        })

        res.status(200).json({ id, name });

    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 422))
    }
}

//============== User Profile =============//
// POST: api/users/logout
// PROTECTED
const logoutUser = (req, res, next) => {
    try {
        // Clear the cookie by setting it with an expired date
        res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        next(new HttpError('Logout failed, please try again', 500));
    }
};


//============== User Profile =============//
// GET: api/users/:id
// PROTECTED

const getUser = async (req, res, next) => {

    try {
        const { id } = req.params; // Ensure this is the correct ID
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError("User not found", 404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}
const getCurrent = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============== Change Avatar =============//
// POST: api/users/change-avatar
// PROTECTED

const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError("Please choose an image", 422))
        }


        // fetch user from db
        const user = await User.findById(req.user.id)
        // delete old avatar if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
        }
        const { avatar } = req.files;
        // check size
        if (avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. Should be less than 500kb", 422))
        }

        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true })
            if (!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed", 422))
            }
            res.status(200).json(updatedAvatar)
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}


//============== Edit Details =============//
// POST: api/users/edit-user
// PROTECTED

const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("Fill in all fields", 422))
        }


        // fetch user
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found", 403))
        }

        // check if email already exists
        const emailExist = await User.findOne({ email });
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exists", 422))
        }
        // compare curr pwd to db pwd
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError("Invalid current password", 422))
        }

        // compare new passwords
        if (newPassword !== confirmNewPassword) {
            return next(new HttpError("Passwords do not match", 422))
        }

        // hash new pwd
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // update user info
        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true })
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}

//============== Authors =============//
// GET: api/users
// UNPROTECTED

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = { registerUser, verifyOTP, resendOTP, loginUser, logoutUser, getUser, getCurrent, changeAvatar, editUser, getAuthors }