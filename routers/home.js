const { Router } = require('express');
const { getUserStatus } = require('../controllers/auth');
const { getAllShoes } = require('../controllers/shoe')

const router = Router();

router.get('/', getUserStatus, async (req, res) => {
    return res.render('home/home', {
        isLogged: req.isLogged,
        username: req.session.username,
        shoes: await getAllShoes()
    })
})

module.exports = router;