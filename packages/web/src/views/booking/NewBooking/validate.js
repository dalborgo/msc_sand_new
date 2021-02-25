import { numeric, validation } from '@adapter/common'
import { getMaxGoodsValue, getMinimumRate } from 'src/utils/logics'
import moment from 'moment'

const numberFields = ['numberContainers', 'goodsQuantity']
const inMillisFields = ['goodsWeight', 'goodsValue', 'rate']
const dateFields = ['bookingDate']
export const checkValues = values => {
  const newValues = validation.objectRemoveEmpty(validation.trimAll(values))
  const defaultRate = numeric.normNumb(getMinimumRate(newValues.importantCustomer, newValues.reeferContainer))
  if (!newValues.sender) {newValues.sender = 'MSC for whom it may concern'}
  if (!newValues.recipients[0]) {newValues.recipients[0] = 'To the orders as per Bill of Lading'}
  for (let key in newValues) {
    const val = newValues[key]
    if (val) {
      if (numberFields.includes(key)) {
        newValues[key] = numeric.toFloat(val)
      }
      if (inMillisFields.includes(key)) {
        newValues[key] = numeric.normNumb(val)
        if (key === 'goodsValue') {
          if (newValues[key] > numeric.normNumb(getMaxGoodsValue(newValues.reeferContainer))) {
            throw Error('booking_error_goodsValue')
          }
        }
      }
      if (dateFields.includes(key)) {
        if (!val.isValid()) {throw Error('booking_error_bookingDate')}
        newValues[key] = moment(val).format('YYYY-MM-DD')
      }
    }
  }
  if (defaultRate !== newValues.rate) {
    newValues.defaultRate = defaultRate
  }
  return newValues
}
