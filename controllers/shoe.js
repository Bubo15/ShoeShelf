const shoeErrorHandler = require('../errors/shoe')
const Shoe = require('../models/shoe');

const { addShoeToUser, getUserById } = require('../controllers/user');

const createShoe = async (req) => {
    const objErrors = await shoeErrorHandler(req);

    if (JSON.stringify(objErrors) !== JSON.stringify({})) {
        return objErrors;
    }

    const { name, price, imageUrl, description, brand } = req.body
    const shoe = new Shoe({ name, price, imageUrl, description, brand, createdAt: new Date(), creatorID: req.session.userID });

    try {
        const shoeObject = await shoe.save();
        await addShoeToUser(req.session.userID, shoeObject.id);
        return objErrors;
    } catch (err) {
        objErrors.errorMessage = err;
        return objErrors;
    }
}

const editShoeById =  async (req) => {
    const objErrors = await shoeErrorHandler(req);
    const shoe = await Shoe.findById(req.params.id)
  
    if(shoe.name === req.body.name){
        delete objErrors.name
    }

    if (JSON.stringify(objErrors) !== JSON.stringify({})) {
        return objErrors;
    }

    await Shoe.findByIdAndUpdate(req.params.id, req.body)
}

const deleteShoeById = async (req) => {
    const shoeId = req.params.id
    const user = await getUserById(req.session.userID)
    const shoeIndex = user.shoes.indexOf(shoeId)

    user.shoes.splice(shoeIndex, 1)

    user.save();

    const isDeleted = await Shoe.findByIdAndDelete(req.params.id);
    return isDeleted
}

const updateShoeBuyers = async (id, buyerId) => {
    await Shoe.findByIdAndUpdate(id, {
        $addToSet: {
            buyers: [buyerId]
        }
    })
}

const getAllShoes = async () => {
    return await Shoe.find().lean();
}

const getShoeById = async (id) => {
    return await Shoe.findById(id);
}

module.exports = {
    createShoe,
    getAllShoes,
    getShoeById,
    deleteShoeById,
    editShoeById,
    updateShoeBuyers
}