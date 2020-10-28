const homeRouter = require('./routers/home')
const authRouter = require('./routers/auth')
const shoesRouter = require('./routers/shoe')

const { getUserStatus } = require('./controllers/auth')

module.exports = (app) => {
    app.use('/', homeRouter)
    app.use('/', authRouter)
    app.use('/shoe', shoesRouter)

    app.get('*', getUserStatus, (req, res) => {
        res.render('404', {
            title: 'Error',
            isLogged: req.isLogged,
            username: req.session.username
        })
    })
} 

