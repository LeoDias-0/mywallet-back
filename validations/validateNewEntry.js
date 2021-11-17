import joi from 'joi'

const validateNewEntry = joi.object({
    value: joi.number().integer().min(0).required(),
    description: joi.string().max(15).required()
}).length(2)

export default validateNewEntry