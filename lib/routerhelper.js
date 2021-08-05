const join = require('path').join
const fs = require('fs')

module.exports = {
  routerRegister: async app => {
    const routerPath = join(__dirname, '../router')
    const stat = fs.statSync(routerPath)
    if (!stat.isDirectory()) {
      throw new Error(`${routerPath} is not a Directory`)
    } else {
      const routerFileNames = fs.readdirSync(routerPath)
      routerFileNames.forEach(filename => {
        const routerFileFullName = join(routerPath, filename)
        const routerFileName = filename.split('.')[0]
        app.use(`/${routerFileName}`, require(routerFileFullName))
      })
    }
  }
}
