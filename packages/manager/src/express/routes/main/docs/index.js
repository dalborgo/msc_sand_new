import { queryById } from '../queries'

const { axios } = require(__helpers)

function addRouters (router) {
  router.get('/docs/get_by_id', async function (req, res) {
    const { docId: id } = req.query
    res.send(await queryById(req, { withMeta: true, id }))
  })
  router.post('/docs/bulk', async function (req, res) {
    const { connClass, body } = req
    const { data } = await axios.restApiInstance(connClass.sgPublic, connClass.sgPublicToken).post(`/${connClass.projectBucketName}/_bulk_docs`, { docs: body.docs })
    res.send(data)
  })
  router.put('/docs/upsert', async function (req, res) {
    const { connClass, body } = req
    const { docId, doc, options } = body
    const { projectBucketCollection: collection } = connClass
    const data = await collection.upsert(docId, doc, options)
    res.send({ ok: true, results: { docId, data } })
  })
  router.delete('/docs/remove', async function (req, res) {
    const { connClass, body } = req
    const { docId, options } = body
    const { projectBucketCollection: collection } = connClass
    const data = await collection.remove(docId, options)
    res.send({ ok: true, results: { docId, data } })
  })
}

export default {
  addRouters,
}
