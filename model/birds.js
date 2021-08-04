const DBWrap = require('../lib/dbwrap')

class Birds {
  constructor (collection) {
    this.collection = collection
  }

  static getInstand () {
    if (!this.instand) {
      this.instand = new Birds('birds')
    }
    return this.instand
  }

  async _getCollection () {
    return (await DBWrap.getClient()).collection(Birds.getInstand().collection)
  }

  async findByName (name) {
    const collection = await Birds.getInstand()._getCollection()

    return await collection.findOne({ name })
  }
}

module.exports = Birds
