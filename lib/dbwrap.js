const MongoClient = require('mongodb').MongoClient

class DBWrap {
  constructor (obj) {
    this.mongo_db = obj.db
    this.mongo_uri = obj.uri
  }

  async _connectMongo () {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(this.mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      client.connect(err => {
        if (err) {
          console.error(`get mongo db client error,error:${err.message}`)
          reject(err)
        } else {
          try {
            global.client = client.db(this.mongo_db)
            resolve(global.client)
          } catch (error) {
            console.error(`get mongo db client error,error:${error.message}`)
            reject(error)
          }
        }
      })
    })
  }

  static async getClient () {
    if (!global.client) {
      await new DBWrap({
        uri: process.env.mongo_uri,
        db: process.env.mongo_db
      })._connectMongo()
    }
    return client
  }

  static initDB () {
    DBWrap.getClient()
  }
}

module.exports = DBWrap
