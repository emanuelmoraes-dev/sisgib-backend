const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const security = require('./src/config/security')

const app = express()

const routers = require('./src/routers')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(security)
app.use('/', routers)

const restful = require('./src/global/restful')
const { Connector, www } = require('alpha-restful')

require('./src/models')
restful.applyRouters(app)

const connector = new Connector('mongodb://localhost/sisgib', restful, app)
www(connector, true)
