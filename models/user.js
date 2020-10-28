const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists']
    },

    username: {
        type: String,
        required: [true, 'Username is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
    },

    shoes: [{
        type: ObjectId,
        ref: 'Shoe'
    }]
})

module.exports = mongoose.model('User', UserSchema);