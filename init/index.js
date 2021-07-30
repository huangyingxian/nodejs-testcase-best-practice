const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const birds = require('../router/birds')

async function getApp () {
  const app = express()

  app.use(bodyParser.json())
  app.use(cors())

  app.use('/birds', birds)

  return app
}

async function init () {}

exports.getApp = getApp

exports.init = init
