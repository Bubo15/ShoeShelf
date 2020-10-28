const { Router } = require('express')
const router = Router();

const { saveUser, verifyUser, getErrorsInObject } = require('../controllers/user')
const { guestAccess, getUserStatus } = require('../controllers/auth')

router.get('/register', guestAccess, getUserStatus, async (req, res) => {
    return res.render('user/register', {
        isLogged: req.isLogged
    })
})

router.post('/register', async (req, res) => {
    const areThereErrors = await saveUser(req, res)

    if (areThereErrors && areThereErrors.length !== 0) {
        return res.render('user/register', {
            errors: getErrorsInObject(areThereErrors),
            email: req.body.email,
            username: req.body.username,
            isLogged: false
        })
    }

    return res.redirect('/');
})

router.get('/login', guestAccess, getUserStatus, async (req, res) => {
    return res.render('user/login', {
        isLogged: req.isLogged
    })
})

router.post('/login', guestAccess, async (req, res) => {
    const { isSuccessfullyLogged } = await verifyUser(req, res);

    if (isSuccessfullyLogged) { return res.redirect('/') }

    return res.render('user/login', {
        username: req.body.username,
        errorMessage: 'Username or password is wrong',
        isLogged: false,
        email: req.body.email
    })
})

router.get('/logout', async (__, res) => {
    res.clearCookie('auth');
    res.redirect('/')
})

module.exports = router;