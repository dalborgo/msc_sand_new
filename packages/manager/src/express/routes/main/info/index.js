import config from 'config'
const { APK = 0 } = config.get('couchbase')
import { couchServer } from '@adapter/io'
import get from 'lodash/get'
const { axios } = require(__helpers)
import log from '@adapter/common/src/winston'
import { validation } from '@adapter/common'
function addRouters (router) {
  router.get('/info/sync_gateway', async function (req, res) {
    const { connClass } = req
    const { data } = await axios.restApiInstance(connClass.sgPublic)('/')
    res.send(data)
  })
  router.get('/info/couch_server', async function (req, res) {
    const { connJSON } = req
    const data = await couchServer.getVersion(connJSON)
    res.send(data)
  })
  router.get('/apk/version', async function (req, res) {
    res.send(String(APK))
  })
  router.get('/info/ping', async function (req, res) {
    const { connClass, query } = req
    const { projectBucket: bucket } = connClass
    const { restart } = query
    const data = await bucket.ping()
    const vkFirstStatus = get(data, 'services.kv[0].status')
    if (vkFirstStatus === 'timeout' && validation.checkQueryBoolean(restart)) {
      setTimeout(() => {
        log.hint('RESTART SERVER DUE KV TIMEOUT PROBLEM!')
        process.exit(1)
      }, 1000)
    }
    res.send({ ok: true, results: { status: vkFirstStatus } })
  })
}

export default {
  addRouters,
}
