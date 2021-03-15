import { couchQueries, ioFiles } from '@adapter/io'
import { generateSoaInput } from './utils'
import path from 'path'
import fs from 'fs'
import Q from 'q'
import { security } from '../../../../helpers'
import { applyFilter } from '../certificates'
import moment from 'moment'

const { utils } = require(__helpers)
const knex = require('knex')({ client: 'mysql' })

const basePath = 'src/express'
const templateFilePath = path.resolve(`${basePath}/public/templates/soa.docx`)

function addRouters (router) {
  router.post('/soa/print/:code', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass: { projectBucketName, cluster }, body, params } = req, partial = {}
    utils.controlParameters(params, ['code'])
    const {
      bucketName = projectBucketName,
      options,
      toSave,
      filter,
    } = body
    const knex_ = knex({ buc: bucketName })
      .select('buc.*')
      .where({ type: 'CERTIFICATE' })
      .orderBy(['_createdAt', 'bookingRef'])
    applyFilter(knex_, filter)
    const statement = knex_.toQuery()
    const { ok, results: certificates, message, err } = await couchQueries.exec(statement, cluster, options)
    if (!ok) {return res.status(412).send({ ok, message, err })}
    const basePath = 'src/express'
    const { code } = params
    const filename = `soa_${code}.pdf`
    {
      const savedFilePath = path.resolve(`${basePath}/crypt/${code}/${filename}`)
      const pathExists = fs.existsSync(savedFilePath)
      if (pathExists) {
        const data = await Q.nfcall(fs.readFile, savedFilePath)
        return res.send(data)
      }
    }
    const input = generateSoaInput(certificates, code)
    {
      const { ok, message, results } = await ioFiles.fillDocxTemplate(templateFilePath, input)
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
  router.post('/soa/create', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass: { projectBucketName, cluster }, body } = req, partial = {}
    utils.controlParameters(body, ['year', 'month'])
    const {
      bucketName = projectBucketName,
      options,
      year,
      month,
    } = body
    const creationDateFrom = `${year}-${month}-01`
    const filter = {
      creationDateFrom,
      creationDateTo: `${year}-${month}-${moment(creationDateFrom).daysInMonth()}`,
    }
    const knex_ = knex({ buc: bucketName })
      .select('buc.*')
      .where({ type: 'CERTIFICATE' })
      .orderBy(['_createdAt', 'bookingRef'])
    applyFilter(knex_, filter)
    const statement = knex_.toQuery()
    const { ok, results: certificates, message, err } = await couchQueries.exec(statement, cluster, options)
    if (!ok) {return res.send({ ok, message, err })}

    const code = `${year}${month}`
    const filename = `soa_${code}.pdf`
    const input = generateSoaInput(certificates)

    {
      const { ok, message, results } = await ioFiles.fillDocxTemplate(templateFilePath, input)
      if (!ok) {return res.send({ ok, message })}
      partial.buffer = results
      partial.correct = ok
    }
    {
      const { ok, message, results } = await ioFiles.docxToPdf(partial.buffer)
      if (!ok) {return res.send({ ok, message })}
      partial.correct &= ok
      if (partial.correct) {
        await ioFiles.saveAndCreateDir(`${basePath}/crypt/${code}/`, filename, results)
      }
      res.send({ok: true, results: {code, filename}})
    }
  })
}

export default {
  addRouters,
}
