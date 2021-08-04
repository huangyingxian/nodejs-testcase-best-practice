require('dotenv').config()
const { init } = require('./init')
const { createServer } = require('http')

async function main () {
  const app = await init()
  const port = parseInt(process.env.PORT) || 3000

  createServer(app).listen(port, err => {
    if (err) {
      console.error('Server init fail')
    } else {
      console.log(`Server listen:${port}`)
    }
  })
}

main()
