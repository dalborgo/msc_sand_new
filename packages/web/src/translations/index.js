import messagesGB from './en-gb.json'
import messagesIT from './it.json'

require('moment/locale/en-gb')
require('moment/locale/it')

export const maskMap = {
  en: '__/__/____',
  it: '__/__/____',
}
export const to2Chars = (val = '') => val.split('-')[1] || val
const translations = {
  'en-gb': messagesGB,
  it: messagesIT,
}
export default translations

