import { reqAuthGet, reqAuthPost } from '../../basicAuth'
import { couchQueries } from '@adapter/io'
import get from 'lodash/get'

const { utils } = require(__helpers)
const knex = require('knex')({ client: 'mysql' })

function addRouters (router) {
  router.get('/services/get_certificate_list', reqAuthGet, async function (req, res) {
    const { connClass, query } = req
    utils.controlParameters(query, ['date'])
    const { date } = query
    const dateFrom = `${date} 00:00:00`
    const dateTo = `${date} 23:59:59`
    const bucketName = connClass.projectBucketName
    const knex_ = knex({ buc: bucketName })
      .select(knex.raw('buc.*, "CERTIFICATE|" || buc.code as id'))
      .where({ type: 'CERTIFICATE' })
      .where(knex.raw('assiHub is missing'))
      .whereBetween('_createdAt', [dateFrom, dateTo])
    const statement = knex_.toQuery()
    const { ok, results, message } = await couchQueries.exec(statement, connClass.cluster)
    if (!ok) {return res.send({ ok, message })}
    res.send({ ok: true, results })
  })
  router.post('/services/set_certificate_list_status', reqAuthPost, async function (req, res) {
    const { connClass, body } = req
    utils.controlParameters(body, ['list'])
    const bucketName = connClass.projectBucketName
    const { list } = body
    const promises = [], listKeys = []
    for (let key in list) {
      listKeys.push(key)
      const assiHub = list[key]
      const statement = `UPDATE \`${bucketName}\` USE KEYS "${key}" SET assiHub = ${JSON.stringify(assiHub)} RETURNING meta().id`
      promises.push(couchQueries.exec(statement, connClass.cluster))
    }
    const response = await Promise.all(promises)
    let count = 0
    const results = response.map(val => {
      const id = listKeys[count++]
      if (val.ok) {
        const resultId = get(val, 'results[0].id')
        if (resultId) {
          return { ok: val.ok, id: resultId }
        } else {
          return { ok: false, message: 'not found', id }
        }
      } else {
        return { ok: val.ok, message: val.message, id }
      }
    })
    res.send({ ok: true, results })
  })
}

export default {
  addRouters,
}
