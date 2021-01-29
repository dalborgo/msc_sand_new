import jwt from 'jsonwebtoken'
import config from 'config'
import { cFunctions } from '@adapter/common'
import { connections } from '../'

const { Unauthorized } = require(__errors)
const { AUTH = 'boobs' } = config.get('express')
const JWT_SECRET = AUTH

function hasAuthorization (headers) {
  if (connections.isInternal(headers) || !cFunctions.isProd()) {return}
  const { authorization } = headers
  if (!authorization) {throw new Unauthorized()}
  const accessToken = authorization.split(' ')[1]
  jwt.verify(accessToken, JWT_SECRET)
}

export default {
  hasAuthorization,
}
