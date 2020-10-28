const userErrorHandler = require('../errors/user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const saveUser = async (req, res) => {
    const { errors } = await userErrorHandler(req)

    if (errors && errors.length !== 0) { return errors }

    const { email, username, password } = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ email, username, password: hashedPassword })

    try {
        const userObject = await user.save()

        const token = getToken({
            userID: userObject.id,
            username: userObject.username
        }, '1h')

        setSession(req, 'userID', userObject.id)
        setSession(req, 'username', username)
        setCookie(res, token, '1h', 'auth', true)
       
        return errors
    } catch (err) {
        errors.push({'error': err})
        return errors
    }
}

const verifyUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email });
        if (!user) { return false; }
        const status = await bcrypt.compare(password, user.password)

        if (status) {
            const token = getToken({
                userID: user.id,
                email: email
            }, '1h')

            setSession(req, 'userID', user.id)
            setSession(req, 'username', user.username)
            setCookie(res, token, '1h', 'auth', true)
        }
      
        return { isSuccessfullyLogged: status }
    } catch (err) {
        return { isSuccessfullyLogged: false }
    }
}

const addShoeToUser = async (userID, shoeID) => {
    await User.findByIdAndUpdate(userID, {
        $addToSet: {
            shoes: [shoeID]
        }
    })
}

const getUserById = async (id) => {
    const user = await User.findById(id);
    console.log(user);
    return user
}

const getErrorsInObject = (arrOfErrors) => {
    let obj = {}
    arrOfErrors.forEach(e => {
        const key = Object.keys(e)[0];
        const values = Object.values(e)[0];
        obj[key] = values;
    })
    return obj;
}

const setCookie = (res, token, expire, name, httpOnly) => {
    res.cookie(name, token, {
        expire: expire,
        httpOnly: httpOnly
    })
}

const setSession = (req, key, value) => {
    req.session[key] = value;
}

const getToken = (data, expire) => {
    return jwt.sign(
        data,
        process.env.PRIVATE_KEY,
        { expiresIn: expire }
    );
}

module.exports = {
    saveUser,
    verifyUser,
    getUserById,
    addShoeToUser,
    getErrorsInObject
};