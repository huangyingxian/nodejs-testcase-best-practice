const express = require('express')
const router = express.Router()
const BirdsServer = require('../server/birds-server')

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log(`request ${req.path} Time: `, new Date().toLocaleString())
//   next()
// })

// define the home page route
router.get('/', async function (req, res) {
  const { name } = Object.assign({}, req.query, req.params)
  const bird = await BirdsServer.getOneBird({ name })
  res.json({ code: 0, data: bird })
})

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
