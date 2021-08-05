const Birds = require('../model/birds')

class BirdsServer {
  static async getOneBird (obj) {
    // TODO 参数校验

    const bird = await Birds.getInstand().findByName(obj.name)

    if (!bird) return 'not found'
    return bird
  }
}

module.exports = BirdsServer
