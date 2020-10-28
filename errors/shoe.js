const e = require('express')
const Shoe = require('../models/shoe')

module.exports = shoeErrorHandler = async (req) => {
    const { name, price, imageUrl } = req.body

    let objErrors = {}

    if (!name) {
        objErrors['name'] = 'Name is required'
    } else {
        const shoe = await Shoe.findOne({ name })
        if (shoe) {
            objErrors['name'] = 'Name already exist'
        }
    }

    if (!price) {
        objErrors['price'] = 'Price is required'
    } else {
        if (Number(price) < 0) {
            objErrors['price'] = 'Price must be positive'
        }
    }

    if (!imageUrl) {
        objErrors['imageUrl'] = 'Image url is required'
    }

    return objErrors
}