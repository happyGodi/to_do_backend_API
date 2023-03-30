import joi from 'joi'

const userSignValidator = (data: object) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })

    return schema.validate(data)
}
const userLogValidator = (data: object) => {
    const schema = joi.object().keys({
        username: joi.string().required(),
        password: joi.string().required()
    })

    return schema.validate(data)
}

const taskValidator = (data: object) => {
    const schema = joi.object().keys({
        taskName: joi.string().required(),
        isDone: joi.boolean().required()
    })

    return schema.validate(data)
}

export  { userSignValidator, taskValidator, userLogValidator }