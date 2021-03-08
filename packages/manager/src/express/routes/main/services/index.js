import { reqAuthGet, reqAuthPost } from '../../basicAuth'
import { couchQueries } from '@adapter/io'

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
      .select('buc.*')
      .where({ type: 'CERTIFICATE' })
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
    let statement = ''
    for (let key in list) {
      const assiHub = list[key]
      statement += `UPDATE \`${bucketName}\` USE KEYS "${key}" SET assiHub = ${JSON.stringify(assiHub)} RETURNING meta().id`
    }
    const { ok, results, message } = await couchQueries.exec(statement, connClass.cluster)
    if (!ok) {return res.send({ ok, message })}
    res.send({ ok: true, results })
  })
}

export default {
  addRouters,
}
