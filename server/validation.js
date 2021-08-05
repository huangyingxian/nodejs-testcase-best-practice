const Joi = require('joi')

module.exports = {
  getOneBirdValidation: async params => {
    const schema = Joi.object({
      name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
    })
    try {
      const value = await schema.validateAsync(params)
      return value
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
