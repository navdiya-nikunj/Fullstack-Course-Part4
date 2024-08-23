const mongoose = require('mongoose');

const blogSchems = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogUser"
    }
})

blogSchems.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = doc._id.toString();
        delete returnObj._id;
        delete returnObj.__v;
    }
})

module.exports = mongoose.model('Blog', blogSchems);