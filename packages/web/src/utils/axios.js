import log from '@adapter/common/src/log'
import readBlob from 'read-blob'
import FileSaver from 'file-saver'
import { axiosLocalInstance } from './reactQueryFunctions'


export async function manageFile (endpoint, filename, type, data, options = {}) {
  try {
    const {
      method = 'POST',
      same = false,
      toDownload = false,
    } = options
    const response = await axiosLocalInstance(endpoint, {
      data,
      method,
      responseType: 'blob',
    })
    if (response.status === 412) {
      const json = await readBlob(response.data, 'application/json')
      return JSON.parse(json)
    } else {
      const file = new File([response.data], filename, { type })
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

export async function exportQuery (endpoint, data, options = {}) {
  try {
    const {
      method = 'POST',
    } = options
    const response = await axiosLocalInstance(endpoint, {
      data,
      method,
    })
    return response.data
  } catch (err) {
    log.error(err.message)
    return { ok: false, message: err.message, err }
  }
}

