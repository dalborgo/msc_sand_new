import { couchQueries, ioFiles } from '@adapter/io'
import { generateSoaInput } from './utils'
import path from 'path'
import fs from 'fs'
import Q from 'q'
import { security } from '../../../../helpers'
import { applyFilter } from '../certificates'

const { utils } = require(__helpers)

const knex = require('knex')({ client: 'mysql' })


function addRouters (router) {
  router.post('/soa/print/:code', async function (req, res) {
    security.hasAuthorization(req.headers)
    const { connClass: { projectBucketName, cluster }, body, params } = req, partial = {}
    utils.controlParameters(params, ['code'])
    const {
      bucketName = projectBucketName,
      options,
      ...filter
    } = body
    const knex_ = knex({ buc: bucketName })
      .select('buc.*')
      .where({ type: 'CERTIFICATE' })
      .orderBy(['bookingDate','bookingRef'])
    applyFilter(knex_, filter)
    const statement = knex_.toQuery()
    const { ok, results: certificates, message, err } = await couchQueries.exec(statement, cluster, options)
    if (!ok) {return res.status(412).send({ ok, message, err })}
    const basePath = 'src/express'
    const { code } = params
    const fileName = `soa_${code}.pdf`
    {
      const savedFilePath = path.resolve(`${basePath}/crypt/${code}/${fileName}`)
      const pathExists = fs.existsSync(savedFilePath)
      if (pathExists) {
        const data = await Q.nfcall(fs.readFile, savedFilePath)
        return res.send(data)
      }
    }
    const { toSave } = body
    const input = generateSoaInput(certificates)
    const filePath = path.resolve(`${basePath}/public/templates/soa.docx`)
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
