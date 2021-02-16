import jwt from 'jsonwebtoken'
import { couchQueries } from '@adapter/io'
import config from 'config'
import log from '@adapter/common/src/winston'
import { cFunctions } from '@adapter/common'
const { security } = require(__helpers)

const { MAXAGE_MINUTES = 30, AUTH = 'boobs' } = config.get('express')
const JWT_SECRET = AUTH
const JWT_EXPIRES_IN = `${MAXAGE_MINUTES} minutes`

const setPriority = role => {
  switch (role) {
    case 'admin':
      return 4
    case 'broker':
      return 3
    default:
      return 2
  }
}

const selectUserFields = identity => ({
  display: identity.user,
  morse: identity.morse,
  priority: setPriority(identity.role),
})

const getQueryUserField = () => '`user`.`user`, `user`.`role`, `user`.`locales` '

const getJwtReturnObj = (connClass, identity) => ({
  bucket: connClass.projectBucketName,
  couchbaseUrl: cFunctions.isProd() ? `${connClass.publicIp}:${connClass.dashboardPort}` : `${connClass.host}:${connClass.dashboardPort}`,
  locales: identity.locales || [],
  user: {
    ...selectUserFields(identity),
  },
})

function addRouters (router) {
  router.post('/jwt/login', async function (req, res) {
    const { connClass, route: { path } } = req
    const { username, password } = req.body
    const query = 'SELECT '
                  + getQueryUserField() + ', meta(`user`).id _id '
                  + 'FROM `' + connClass.projectBucketName + '` `user` '
                  + 'WHERE `user`.type = "USER_MANAGER" '
                  + 'AND LOWER(`user`.`user`) = $1 '
                  + 'AND `user`.`password` = $2'
    
    const {
      ok,
      results,
      message,
      err,
    } = await couchQueries.exec(query, connClass.cluster, { parameters: [username.toLowerCase().trim(), String(password).trim()] })
    if (!ok) {
      log.error('path', path)
      throw Error(err.context ? err.context.first_error_message : message)
    }
    if (!results.length) {
      return res.status(400).send({ code: 'LOGIN_WRONG_CREDENTIALS' })
    }
    const [identity] = results
    const accessToken = jwt.sign(
      { userId: identity._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
    res.send({
      accessToken,
      ...getJwtReturnObj(connClass, identity),
    })
  })
  router.get('/jwt/me', async function (req, res) {
    const { connClass, route: { path } } = req
    const { authorization } = req.headers
    const accessToken = authorization.split(' ')[1]
    const { userId } = jwt.verify(accessToken, JWT_SECRET)
    const query = 'SELECT '
                  + getQueryUserField()
                  + 'FROM `' + connClass.projectBucketName + '` `user` USE KEYS "' + userId + '"'
    const { ok, results, message, err } = await couchQueries.exec(query, connClass.cluster)
    if (!ok) {
      log.error('path', path)
      throw Error(err.context ? err.context.first_error_message : message)
    }
    if (!results.length) {
      return res.status(400).send({ message: 'Wrong authentication code!' })
    }
    const [identity] = results
    res.send({
      ...getJwtReturnObj(connClass, identity),
    })
  })
  router.get('/jwt/check_session', async function (req, res) {
    security.hasAuthorization(req.headers)
    res.send({ ok: true })
  })
}

export default {
  addRouters,
}
