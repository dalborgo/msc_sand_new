#!/usr/bin/env node
import log from '@adapter/common/src/winston'
import app from './express'
import config from 'config'
import http from 'http'

const { PORT } = config.get('express')
const port = normalizePort(PORT || 4000)
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort (val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      log.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      log.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

async function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  log.info(`Backend listening on ${bind}`)
}
