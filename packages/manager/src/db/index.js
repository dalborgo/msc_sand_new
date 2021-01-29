import config from 'config'
import couchbase from 'couchbase'
import log from '@adapter/common/src/winston'
import Couchbase from './class'
import { cFunctions } from '@adapter/common'

const { connections: connections_ } = require(__helpers)
const { connections, CONFIG_TOTAL_TIMEOUT } = config.get('couchbase')

let connInstance

void (async () => {
  try {
    const key = 'defaultServer'
    const connection = connections[key]
    const optionsProject = {
      username: connection._user_bucket || connection._bucket,
      password: connection._password_bucket || connection._bucket,
      logFunc: connections_.logFunc,
    }
    const extraOptions = {
      serviceRestProtocol: connection.service_rest_protocol || 'http',
      sgAdmin: connection.sg_admin,
      sgAdminToken: connection.sg_admin_token,
      sgPublic: connection.sg_public,
      sgPublicToken: connection.sg_public_token,
    }
    const queryString = cFunctions.objToQueryString({ certpath: connection._certpath, config_total_timeout: CONFIG_TOTAL_TIMEOUT }, true)
    const prefix = connection._certpath ? 'couchbases' : 'couchbase'
    const connStr = `${prefix}://${connection.server}${queryString}`
    log.debug('connStr', connStr)
    const project_ = new couchbase.Cluster(connStr, optionsProject)
    const project = project_.bucket(connection._bucket)
    __buckets[key] = new Couchbase(project_, project, extraOptions) // first parameter for cluster
    const conn = __buckets[key]
    connInstance = conn.archiveBucketCollection
  } catch (err) {
    log.error('CB connection error:', err)
    err.cause && log.error('code:', err.cause.code)
  }
})()

export {
  connInstance,
}
