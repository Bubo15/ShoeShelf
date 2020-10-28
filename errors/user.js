const { validate } = require('../validations/user')

const errorHandler = (arrOfErrors) => {
    const types = {
        email: async (email) => {
            const emailErr = {
                email: []
            };

            emailErr.email.push(validate.user.email.isRequired(email, true, 'Email is require'));

            if (emailErr.email[0] === "") {
                emailErr.email.push(validate.user.email.correctEmail(email, 'Email is not valid'));
                emailErr.email.push(await validate.user.email.isExist('email', email, 'Email Already exist'))
            }

            arrOfErrors.push(emailErr)
        },
        username: (username) => {
            const usernameErr = {
                username: []
            };

            usernameErr.username.push(validate.user.username.isRequired(username, true, 'Username is required'))
            arrOfErrors.push(usernameErr)
        },
        password: (password) => {
            const passwordErr = {
                password: []
            };

            passwordErr.password.push(validate.user.password.minLength(password, 4, 'Password must be least 3 symbols'))
            passwordErr.password.push(validate.user.password.constinsOnly(password, '^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$', 'Password must contains only digits and '))

            arrOfErrors.push(passwordErr)
        },
        rePassword: async (password, rePassword) => {
            const rePasswordErr = {
                rePassword: []
            };

            rePasswordErr.rePassword.push(await validate.user.repeatPassword.isEqualsWithPassword(password, rePassword, 'Password does not match'))

            arrOfErrors.push(rePasswordErr)
        }
    }

    return types;
}

module.exports = userErrorHandler = async (req) => {
    let arrOfErrors = [];

    const { email, username, password, rePassword } = req.body;

   await errorHandler(arrOfErrors).email(email)
    errorHandler(arrOfErrors).username(username)
    errorHandler(arrOfErrors).password(password)
   await errorHandler(arrOfErrors).rePassword(password, rePassword)

    let errors = []

    arrOfErrors.filter(arr => {
        const key = Object.keys(arr)[0];
        arr = Object.values(arr)[0].filter(mess => mess !== "")

        if(Object.values(arr).length > 0){
            errors.push({[`${key}`]: arr})
        }
    })

    return {
        errors
    }
}