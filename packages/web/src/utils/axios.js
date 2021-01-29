import axios from 'axios'
import log from '@adapter/common/src/log'
import { envConfig } from 'src/init'
import readBlob from 'read-blob'
import FileSaver from 'file-saver'

const instance = axios.create({
  baseURL: `${envConfig.BACKEND_HOST}/msc`,
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status === 412 //il 412 lo uso come identificativo di una risposta errata
  },
})

export async function manageFile (endpoint, fileName, type, data, options = {}) {
  try {
    const {
      method = 'POST',
      same = false,
      toDownload = false,
    } = options
    const response = await instance(endpoint, {
      data,
      method,
      responseType: 'blob',
    })
    if (response.status === 412) {
      const json = await readBlob(response.data, 'application/json')
      return JSON.parse(json)
    } else {
      const file = new File([response.data], fileName, { type })
      if (toDownload) {
        FileSaver.saveAs(file)
      } else {
        const exportUrl = URL.createObjectURL(file)
        window.open(exportUrl, same ? '_self' : '_blank')
        URL.revokeObjectURL(exportUrl)
      }
      return { ok: true }
    }
  } catch (err) {
    log.error(err.message)
    return { ok: false, message: err.message, err }
  }
}


export default instance
