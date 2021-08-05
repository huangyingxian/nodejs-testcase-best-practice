const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', async function (req, res) {
  res.send('User home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About User')
})

module.exports = router
