var mongoose = require("mongoose");
const { ObjectId } = require("mongoose");

var tinyUrlSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        maxlength: 10,
        trim: true,
        unique: true
    },
    link: {
        type: String,
        trim: true,
        required: true,
    },
    public: {
        type: Boolean,
        default: true
    },
    count: {
        type: Number,
        default: 0
    },
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("TinyUrl", tinyUrlSchema);