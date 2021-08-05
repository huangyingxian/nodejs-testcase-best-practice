const express = require('express')
const router = express.Router()
const BirdsServer = require('../server/birds-server')

// define the home page route
router.get('/', async function (req, res, next) {
  try {
    const requestParams = Object.assign({}, req.query, req.params)
    const bird = await BirdsServer.getOneBird({ name: requestParams.name })
    res.json({ code: 0, data: bird })
  } catch (error) {
    next(error)
  }
})

// define the about route
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
