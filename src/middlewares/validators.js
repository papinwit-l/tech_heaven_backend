const Joi = require('joi')
const createError = require('../utils/createError')

//Joi object

//Auth path
const registerSchema = Joi.object({
    email: Joi
        .string()
        .email({ tlds: false })
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.base": "Email datatype must be a string.",
            "string.email": "Email must be valid."
        }),
    password: Joi
        .string()
        .required()
        .min(6)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]\/:;"'<>,.?`~])[A-Za-z\d!@#$%^&*()_+=\-{}\[\]\/:;"'<>,.?`~]{1,}$/)
        .messages({
            "string.empty": "Password is required.",
            "string.base": "Password must be a string.",
            "string.min": "Password should have length between 6 to 30 characters.",
            "string.max": "Password should have length between 6 to 30 characters.",
            "string.pattern.base": "Password should be at least one upper letter, one lower letter, one number and one special symbol."
        }),
    confirmPassword: Joi
        .string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            'any.only': "password does not match.",
            "string.empty": "Confirm password is required.",
        }),
    firstName: Joi
        .string()
        .required()
        .messages({
            "string.empty": "firstName is required.",
            "string.base": "firstName datatype must be a string.",
            "string.email": "firstName must be valid."
        }),
    lastName: Joi
        .string()
        .required()
        .messages({
            "string.empty": "lastName is required.",
            "string.base": "lastName datatype must be a string.",
            "string.email": "lastName must be valid."
        }),
    dateOfBirth: Joi
        .date()
        .less('now')
        .required()
        .messages({
            "date.base": "Date of birth must be a valid date.",
            "date.less": "Date of birth must be in the past.",
            "any.required": "Date of birth is required."
        })
})
const loginSchema = Joi.object({
    username: Joi
        .string()
        .required()
        .messages({
            "string.empty": "Username is required.",
            "string.base": "Username invalid."
        }),
    password: Joi
        .string()
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.base": "Password invalid."
        }),
})


//validate function
const validateSchema = (schema) => (req, res, next) => {
    console.log(req.body, "kkkkkkkkkkkkkk")
    const { value, error } = schema.validate(req.body)
    if (error) {
        return createError(400, error.details[0].message)
    }
    req.input = value
    next();
}





exports.registerValidator = validateSchema(registerSchema)
exports.loginValidator = validateSchema(loginSchema)