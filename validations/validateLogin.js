import joi from 'joi'

const validateLogin = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required(),
    password: joi.string().min(6).max(60).required()
}).length(2)

export default validateLogin