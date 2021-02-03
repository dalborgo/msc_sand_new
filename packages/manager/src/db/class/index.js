import get from 'lodash/get'
import config from 'config'

const { connections } = config.get('couchbase')
const {
  _bucket: PROJ_DEFAULT,
  backend: BACKEND_HOST_DEFAULT,
  server: HOST_DEFAULT,
} = connections['defaultServer']

export default class Couchbase {
  constructor (cluster, project, options, backendHost = BACKEND_HOST_DEFAULT) {
    this._cluster = cluster
    this._project = project
    this._backendHost = backendHost || ''
    this._op = options || {}
  }
  
  get cluster () {
    return this._cluster
  }
  
  get host () {
    return this.connHost()
  }
  
  
  get publicIp () {
    return this._op['publicIp'] || this.connHost()
  }
  
  get dashboardPort () {
    return this._op['dashboardPort'] || 8091
  }
  
  get serviceRestProtocol () {
    return this._op['serviceRestProtocol']
  }
  
  get backendHost () {
    return this._backendHost
  }
  
  get connJSON () {
    return {
      HOST: this.host,
      BACKEND_HOST: this.backendHost,
    }
  }
  
  get projectBucketName () {
    return this._project.name || PROJ_DEFAULT
  }
  
  get projectBucketCollection () {
    return this._project.defaultCollection()
  }
  
  get projectBucket () {
    return this._project
  }
  
  get projConnection () {
    return {
      BUCKET: this.projectBucket,
      BUCKET_NAME: this.projectBucketName,
      CLUSTER: this.cluster,
      COLLECTION: this.projectBucketCollection,
      DASHBOARD_PORT: this.dashboardPort,
      HOST: this.host,
      PASSWORD: this.projectBucketPassword(),
      PUBLIC_IP: this.publicIp,
      SERVICE_REST_PROTOCOL: this.serviceRestProtocol,
    }
  }
  
  connHost () {
    const base = get(this._project, '_cluster._connStr', HOST_DEFAULT)
    const regex = /couchbase:\/\/([a-z\d.]+)\??/
    const match = regex.exec(base)
    if (match) {
      const [_, group] = match
      return group
    } else {
      return HOST_DEFAULT
    }
  }
  
  projectBucketPassword () {
    const base = get(this._project, '_cluster._auth')
    return base.password
  }
  
  toString () {
    return '[@MSC_CONNECTION_OBJECT]'
  }
  
}

