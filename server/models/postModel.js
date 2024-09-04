{/* Database post schema */}

const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String, enum: ["AI", "Frontend", "Git", "Practices", "CyberSec", "Entertainment"], message: "{VALUE} is not supported"
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    thumbnail: { type: String, required: true },
}, { timestamps: true });

module.exports = model('Post', postSchema);


