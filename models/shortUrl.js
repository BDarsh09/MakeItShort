const mongoose = require('mongoose')
var { nanoid } = require("nanoid");

const shortUrlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: nanoid(10)
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)