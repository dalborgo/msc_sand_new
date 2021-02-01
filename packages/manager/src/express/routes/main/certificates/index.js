import { couchQueries, ioFiles } from '@adapter/io'
import { generateInput } from './utils'
import { validation } from '@adapter/common'
import padStart from 'lodash/padStart'
import path from 'path'
import fs from 'fs'
import Q from 'q'
import log from '@adapter/common/src/winston'

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

const listFields = ['code', 'policyNumber', 'bookingRef','portDischarge', 'portLoading']

function addRouters (router) {
  router.post('/certificates/save', async function (req, res) {
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
    res.send({ ok: true, results: validation.filterByArray(input, listFields) })
  })
  router.get('/certificates/list', async function (req, res) {
    const { connClass, query } = req
    utils.controlParameters(query, [])
    const {
      bucketName = connClass.projectBucketName,
      typeOfGoods,
      options,
    } = query
    const knex_ = knex(bucketName)
      .where({ type: 'CERTIFICATE' })
      .select(listFields)
      .orderBy('sequence', 'desc')
    if(typeOfGoods){knex_.where({ typeOfGoods })}
    const statement = knex_.toQuery()
    const { ok, results, message, err } = await couchQueries.exec(statement, connClass.cluster, options)
    if (!ok) {return res.send({ ok, message, err })}
    res.send({ ok, results })
  })
  
  router.post('/certificates/print/:code', async function (req, res) {
    const basePath = 'src/express'
    const { connClass: { projectBucketCollection: collection }, params, body } = req, partial = {}
    utils.controlParameters(params, ['code'])
    const { code } = params
    const fileName = `cert_${code}.pdf`
    {
      const savedFilePath = path.resolve(`${basePath}/crypt/${code}/${fileName}`)
      const pathExists = fs.existsSync(savedFilePath)
      if (pathExists) {
        const data = await Q.nfcall(fs.readFile, savedFilePath)
        return res.send(data)
      }
    }
    const { content: certificate } = await collection.get(`CERTIFICATE|${code}`)
    const { toSave } = body
    const input = generateInput(certificate)
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
        await ioFiles.saveAndCreateDir(`${basePath}/crypt/${code}/`, fileName, results)
      }
    }
  })
}

export default {
  addRouters,
}
