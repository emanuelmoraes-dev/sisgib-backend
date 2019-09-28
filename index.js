const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const restful = require('./src/global/restful')
const { Connector, www } = require('alpha-restful')

require('./src/model')
restful.applyRouters(app)

const connector = new Connector('mongodb://localhost/sisgib', restful, app)
www(connector, true)
