import joi from 'joi'

const validateSign = joi.object({
    name: joi.string().min(3).max(60).required(),
    email: joi.string().email({tlds: {allow: false}}).required(),
    password: joi.string().min(6).max(60).required()
}).length(3)

export default validateSign