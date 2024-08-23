const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    hashedPassword: {
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (doc, returnObject) => {
        returnObject.id = doc._id.toString();
        delete returnObject._id;
        delete returnObject.__v;
        delete returnObject.hashedPassword;
    }
})


module.exports = mongoose.model('BlogUser', userSchema);