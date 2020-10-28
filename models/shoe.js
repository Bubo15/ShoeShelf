const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const ShoeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'Name already exist']
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price can not be negative']
    },

    imageUrl: {
        type: String,
        required: [true, 'Image Url is required'],
    },

    description: {
        type: String,
    },

    brand: {
        type: String,
    },

    createdAt: {
        type: String,
    },

    creatorID: {
        type: ObjectId,
        ref: 'User'
    },

    buyers: [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Shoe', ShoeSchema);