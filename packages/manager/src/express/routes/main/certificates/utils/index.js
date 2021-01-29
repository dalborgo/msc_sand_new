import { cDate, numeric } from '@adapter/common'
import { getTypeOfGood } from '@adapter/common/src/msc'
import { ToWords } from 'to-words'
import get from 'lodash/get'

export const generateInput = cert => {
  const toWords = new ToWords()
  const typeOfGoods = getTypeOfGood(cert.typeOfGoods)
  let from, to
  const countryPortLoadingValue = get(cert, 'countryPortLoading.value', '')
  const countryPortDischargeValue = get(cert, 'countryPortDischarge.value', '')
  const countryDeliveryPointValue = get(cert, 'countryDeliveryPoint.value', '')
  const countryCollectionPointValue = get(cert, 'countryCollectionPoint.value', '')
  const portLoadingValue = get(cert, 'portLoading.value', '')
  const portDischargeValue = get(cert, 'portDischarge.value', '')
  const portLoadingKey = get(cert, 'portLoading.key', '')
  const portDischargeKey = get(cert, 'portDischarge.key', '')
  switch (cert.insuranceType) {
    case 'port-to-door':
      from = `${countryPortLoadingValue}\n${portLoadingValue}${portLoadingKey ? ` (${portLoadingKey})` : ''}`
      to = `${countryDeliveryPointValue}${cert.cityDeliveryPoint ? ` - ${cert.cityDeliveryPoint}`: ''}`
      break
    case 'port-to-port':
      from = `${countryPortLoadingValue}\n${portLoadingValue}${portLoadingKey ? ` (${portLoadingKey})` : ''}`
      to = `${countryPortDischargeValue}\n${portDischargeValue}${portDischargeKey ? ` (${portDischargeKey})` : ''}`
      break
    case 'door-to-port':
      from = `${countryCollectionPointValue}${cert.cityCollectionPoint ? ` - ${cert.cityCollectionPoint}`: ''}`
      to = `${countryPortDischargeValue}\n${portDischargeValue}${portDischargeKey ? ` (${portDischargeKey})` : ''}`
      break
    default: //door-to-door
      from = `${countryCollectionPointValue}${cert.cityCollectionPoint ? ` - ${cert.cityCollectionPoint}`: ''}`
      to = `${countryDeliveryPointValue}${cert.cityDeliveryPoint ? ` - ${cert.cityDeliveryPoint}`: ''}`
  }
  return {
    ...cert,
    bookingDate: cDate.mom(cert.bookingDate, null, 'DD/MM/YYYY'),
    from,
    goodsValue: numeric.printDecimal(cert.goodsValue / 1000),
    goodsWeight: cert.goodsWeight ? numeric.printDecimal(cert.goodsWeight / 1000, 0) : '',
    notReeferContainer: cert.reeferContainer ? '   ' : 'X',
    reeferContainer: cert.reeferContainer ? 'X' : '   ',
    to,
    today: cDate.mom(null, null, 'DD/MM/YYYY'),
    typeOfGoods: typeOfGoods.value || '',
    valueInLetters: toWords.convert((cert.goodsValue || 0) / 1000),
  }
}
