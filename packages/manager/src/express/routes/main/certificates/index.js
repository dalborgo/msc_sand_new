import { couchQueries, ioFiles } from '@adapter/io'
import { generateCertificatesInput } from './utils'
import { numeric, validation } from '@adapter/common'
import padStart from 'lodash/padStart'
import path from 'path'
import fs from 'fs'
import Q from 'q'
import log from '@adapter/common/src/winston'
import { security } from '../../../../helpers'

const { utils, axios } = require(__helpers)
const INITIAL_COUNT = 1000

const knex = require('knex')({ client: 'mysql' })

async function getSequence (connClass) {
  const statement = 'SELECT RAW '
                    + 'IFNULL(MAX(sequence), 0) '
                    + 'FROM ' + connClass.projectBucketName + ' '
                    + 'WHERE type = "CERTIFICATE"'
  const { ok, results, message, err } = await couchQueries.exec(statement, connClass.cluster)
  if (!ok) {return { ok, message, err }}
  let [sequence] = results
  return { ok, results: sequence ? ++sequence : INITIAL_COUNT + 1 }
}

const listFields = ['code', 'policyNumber', 'bookingRef', 'portDischarge', 'portLoading']

export function applyFilter (knex_, filter) {
  if (filter.typeOfGoods) {knex_.where({ typeOfGoods: filter.typeOfGoods })}
  if (filter.countryPortLoading) {knex_.where({ 'countryPortLoading.value': filter.countryPortLoading.value })}
  if (filter.portLoading) {knex_.where({ 'portLoading.key': filter.portLoading.key })}
  if (filter.countryPortDischarge) {knex_.where({ 'countryPortDischarge.value': filter.countryPortDischarge.value })}
  if (filter.portDischarge) {knex_.where({ 'portDischarge.key': filter.portDischarge.key })}
  if (filter.bookingRef) {knex_.whereRaw(`LOWER(bookingRef) like "%${filter.bookingRef.toLowerCase()}%"`)}
  const dateFrom = filter.bookingDateFrom || '1900-01-01'
  const dateTo = filter.bookingDateTo || '2100-01-01'
  const minGoodsValue = filter.minGoodsValue ? numeric.normNumb(filter.minGoodsValue) : 0
  const maxGoodsValue = filter.maxGoodsValue ? numeric.normNumb(filter.maxGoodsValue) : 999999999999
  if (filter.bookingDateFrom || filter.bookingDateTo) {knex_.whereBetween('bookingDate', [dateFrom, dateTo])}
  if (filter.minGoodsValue || filter.maxGoodsValue) {knex_.whereBetween('goodsValue', [minGoodsValue, maxGoodsValue])}
  if(filter.typeRate === 'exception'){knex_.whereRaw('defaultRate is valued')}
  if(filter.typeRate === 'not_exception'){knex_.whereRaw('defaultRate is missing')}
}

function addRouters (router) {
  router.post('/certificates/save', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass, body } = req
    log.info('req.body', body)
    const { ok, results: sequence, message, err } = await getSequence(connClass)
    if (!ok) {return res.send({ ok, message, err })}
    const { projectBucketCollection: collection } = connClass
    const code = `${padStart(sequence, 6, '0')}`
    const input = {
      ...body,
      _createdAt: (new Date()).toISOString(),
      code,
      policyNumber: '00215192000258', // hardcoded
      sequence,
      type: 'CERTIFICATE',
    }
    await collection.insert(`CERTIFICATE|${code}`, input)
    /* axios.localInstance(`certificates/print/${code}`, { // in parallelo
      data: { toSave: true },
      method: 'POST',
      responseType: 'blob',
    })*/
    res.send({
      ok: true, results: {
        containers: input.numberContainers,
        importantCustomers: input.importantCustomer ? 1 : 0,
        certificate: validation.filterByArray(input, listFields),
      },
    })
  })
  router.get('/certificates/list', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass, query } = req
    utils.controlParameters(query, [])
    const {
      bucketName = connClass.projectBucketName,
      options,
      ...filter
    } = query
    const knex_ = knex(bucketName)
      .where({ type: 'CERTIFICATE' })
      .select(listFields)
      .orderBy('sequence', 'desc')
    const knexStats_ = knex(bucketName)
      .select(knex.raw('IFNULL(SUM(numberContainers),0) totalContainers, SUM(CASE WHEN importantCustomer = TRUE THEN 1 ELSE 0 END) totalImportantCustomers'))
      .where({ type: 'CERTIFICATE' })
    applyFilter(knex_, filter)
    applyFilter(knexStats_, filter)
    const statement = knex_.toQuery()
    const statementStats = knexStats_.toQuery()
    const promises = []
    promises.push(couchQueries.exec(statement, connClass.cluster, options))
    promises.push(couchQueries.exec(statementStats, connClass.cluster, options))
    const [listResponse, statsResponse] = await utils.allSettled(promises)
    if (!listResponse.ok || !statsResponse.ok) {
      return res.send({
        ok: false,
        message: listResponse.message || statsResponse.message,
        err: listResponse.err || statsResponse.err,
      })
    }
    const [stats] = statsResponse.results
    stats.total = listResponse.results.length
    stats.totalImportantCustomers = stats.totalImportantCustomers || 0
    res.send({
      ok: true,
      results: {
        list: listResponse.results,
        stats,
      },
    })
  })
  router.post('/certificates/export', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass, body } = req
    const {
      bucketName = connClass.projectBucketName,
      options,
      ...filter
    } = body
    const knex_ = knex({ buc: bucketName })
      .select('buc.*')
      .where({ type: 'CERTIFICATE' })
      .orderBy(['bookingDate','bookingRef'])
    applyFilter(knex_, filter)
    const statement = knex_.toQuery()
    const { ok, results, message, err } = await couchQueries.exec(statement, connClass.cluster, options)
    if (!ok) {return res.send({ ok, message, err })}
    res.send({ ok, results })
  })
  
  router.post('/certificates/print/:code', async function (req, res) {
    security.hasAuthorization(req.headers)
    const basePath = 'src/express'
    const { connClass: { projectBucketCollection: collection }, params, body } = req, partial = {}
    utils.controlParameters(params, ['code'])
    const { code } = params
    const filename = `cert_${code}.pdf`
    {
      const savedFilePath = path.resolve(`${basePath}/crypt/${code}/${filename}`)
      const pathExists = fs.existsSync(savedFilePath)
      if (pathExists) {
        const data = await Q.nfcall(fs.readFile, savedFilePath)
        return res.send(data)
      }
    }
    const { content: certificate } = await collection.get(`CERTIFICATE|${code}`)
    const { toSave } = body
    const input = generateCertificatesInput(certificate)
    const filePath = path.resolve(`${basePath}/public/templates/msc_certificate.docx`)
    {
      const { ok, message, results } = await ioFiles.fillDocxTemplate(filePath, input)
      if (!ok) {return res.status(412).send({ ok, message })}
      partial.buffer = results
      partial.correct = ok
    }
    {
      const { ok, message, results } = await ioFiles.docxToPdf(partial.buffer)
      if (!ok) {return res.status(412).send({ ok, message })}
      partial.correct &= ok
      res.send(results)
      if (partial.correct && toSave) {
        await ioFiles.saveAndCreateDir(`${basePath}/crypt/${code}/`, filename, results)
      }
    }
  })
}

export default {
  addRouters,
}
