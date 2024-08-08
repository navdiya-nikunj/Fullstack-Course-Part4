const mongoose = require('mongoose');

const blogSchems = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchems.set('toJSON', {
    transform: (doc, returnObj) => {
        returnObj.id = doc._id.toString();
        delete returnObj._id;
        delete returnObj.__v;
    }
})

module.exports = mongoose.model('Blog', blogSchems);