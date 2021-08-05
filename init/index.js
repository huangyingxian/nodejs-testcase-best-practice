require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const middleware = require('../lib/middleware')
const DBWrap = require('../lib/dbwrap')
const routerHelper = require('../lib/routerhelper')

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
}

// application init
async function init () {
  const app = await getApp()

  await initExpress(app)
  await routerHelper.routerRegister(app)

  DBWrap.initDB()

  return app
}

exports.getApp = getApp

exports.init = init
