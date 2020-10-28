const User = require('../models/user')

const common = {
    isRequired: (obj, flag, message) => {
        if (flag && !obj) {
            return message
        } else {
            return ""
        }
    },
    isExist: async (key, value, message) => {
        const isExist = await User.exists({ [`${key}`]: value })
        if (isExist) {
            return message
        }
        return ""
    }
}

const validate = {
    user: {
        email: {
            correctEmail: (email, message) => {
                return (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? message : "")
            },
            isRequired: (obj, flag, message) => {
               return common.isRequired(obj, flag, message)
            },
            isExist: async (key, value, message) => {
               return await common.isExist(key, value, message)
            }
        },
        username: {
            minLength: (username, minLength, message) => {
                if (username.length < minLength) {
                    return message
                }
                return ""
            },
            maxLength: (username, maxLength, message) => {
                if (username.length > maxLength) {
                    return message
                }
                return ""
            },
            isRequired: (obj, flag, message) => {
               return common.isRequired(obj, flag, message)
            },
            isExist: (key, value, message) => {
               return common.isExist(key, value, message)
            }
        },
        password: {
            isRequired: (obj, flag, message) => {
                common.isRequired(obj, flag, message)
            },
            minLength: (password, minLength, message) => {
                if (password.length < minLength) {
                    return message
                }
                return ""
            },
            maxLength: (password, maxLength, message) => {
                if (password.length > maxLength) {
                    return message
                }
                return ""
            },
            constinsOnly: (password, regex, message) => {
                return (!password.match(regex) ? message : "")
            }
        },
        repeatPassword: {
            isEqualsWithPassword: async (password, repeatPassword, message) => {
                return await (JSON.stringify(password) !== JSON.stringify(repeatPassword) ? message : "")
            }
        }
    }
}

module.exports = {
    validate
}