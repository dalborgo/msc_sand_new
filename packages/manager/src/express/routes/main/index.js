import certificates from './certificates'
import docs from './docs'
import info from './info'
import jwt from './jwt'
import queries from './queries'
import soa from './soa'
import stats from './stats'
import types from './types'

const express = require('express')
const router = express.Router()
require('express-async-errors')

certificates.addRouters(router)
docs.addRouters(router)
info.addRouters(router)
jwt.addRouters(router)
queries.addRouters(router)
soa.addRouters(router)
stats.addRouters(router)
types.addRouters(router)

router.get('/', function (req, res) {
  res.redirect('/')
})

export default router


