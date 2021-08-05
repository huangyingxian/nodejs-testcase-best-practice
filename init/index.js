require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const birds = require('../router/birds')
const person = require('../router/person')
const middleware = require('../lib/middleware')
const DBWrap = require('../lib/dbwrap')

// get app instand
async function getApp () {
  const app = express()
  return app
}

// init express
async function initExpress (app) {
  app.use(bodyParser.json())
  app.use(cors())

  // log middleware
  app.use(middleware.timeLog)

  // errHandle
  app.use(middleware.errorHandle)

  app.use('/birds', birds)
  app.use('/person', person)
}

// application init
async function init () {
  const app = await getApp()

  await initExpress(app)
  DBWrap.initDB()

  return app
}

exports.getApp = getApp

exports.init = init
