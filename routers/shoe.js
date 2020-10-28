const { Router } = require('express');
const { getUserStatus, isAuthenticated } = require('../controllers/auth');
const { createShoe, getShoeById, deleteShoeById, editShoeById, updateShoeBuyers } = require('../controllers/shoe')

const router = Router();

router.get('/create', isAuthenticated, getUserStatus, async (req, res) => {
    return res.render('shoes/create', {
        isLogged: req.isLogged,
        username: req.session.username,
    })
})

router.post('/create', isAuthenticated, async (req, res) => {
    const areThereErrors = await createShoe(req)

    if (JSON.stringify(areThereErrors) !== JSON.stringify({})) {
        return res.render('shoes/create', {
            errors: areThereErrors,
            username: req.session.username,
            isLogged: true
        })
    }

    return res.redirect('/')
})

router.get('/details/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const shoe = await getShoeById(req.params.id);
    return res.render('shoes/details', {
        shoe,
        isLogged: req.isLogged,
        username: req.session.username,
        id: shoe.id,
        name: shoe.name,
        price: shoe.price,
        description: shoe.description,
        buyers: shoe.buyers.length,
        imageUrl: shoe.imageUrl,
        isCurrentUserCreatedShoe: JSON.stringify(shoe.creatorID) === `"${req.session.userID}"`
    })
})

router.get('/edit/:id', isAuthenticated, getUserStatus, async (req, res) => {
    const shoe = await getShoeById(req.params.id);
    return res.render('shoes/edit', {
        id: shoe.id,
        name: shoe.name,
        price: shoe.price,
        imageUrl: shoe.imageUrl,
        description: shoe.description,
        brand: shoe.brand
    })
})

router.post('/edit/:id', getUserStatus, async (req, res) => {
    const areThereErrors = await editShoeById(req)
    const shoe = await getShoeById(req.params.id);
    if (areThereErrors && areThereErrors.length !== 0) {
        return res.render('shoes/edit', {
            errors: areThereErrors,
            isLogged: req.isLogged,
            username: req.session.username,
            id: shoe.id,
            name: shoe.name,
            price: shoe.price,
            imageUrl: shoe.imageUrl,
            description: shoe.description,
            brand: shoe.brand
        })
    }

    return res.redirect('/')
})

router.get('/delete/:id', async (req, res) => {
    const isDeleted = await deleteShoeById(req);

    if (isDeleted) {
        return res.redirect('/')
    }

    return res.status(404);
})

router.get('/buy/:id', async (req, res) => {
    await updateShoeBuyers(req.params.id, req.session.userID)
    return res.redirect('/')
})

module.exports = router;