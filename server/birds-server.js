const Birds = require('../model/birds')
const validation = require('./validation')

class BirdsServer {
  static async getOneBird (obj) {
    // 参数校验
    const value = await validation.getOneBirdValidation(obj)

    const bird = await Birds.getInstand().findByName(value.name)

    if (!bird) return 'not found'
    return bird
  }
}

module.exports = BirdsServer
