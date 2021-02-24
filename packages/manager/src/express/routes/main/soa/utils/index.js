import { cDate, numeric } from '@adapter/common'

export const generateSoaInput = certificates => {
  const cL = []
  let totalEurNetPr = 0, totalUsdNetPr = 0
  for (let certificate of certificates) {
    const { bookingDate, currencyGoods, policyNumber, bookingRef } = certificate
    const isEur = currencyGoods === 'EUR'
    const goodsValue = (certificate.goodsValue / 1000) || 0
    const rate = (certificate.rate / 1000) || 0
    const netPremium = goodsValue * rate / 100
    totalEurNetPr += isEur ? netPremium : 0
    totalUsdNetPr += !isEur ? netPremium : 0
    cL.push({
      bookingRef,
      currencyGoods,
      effDate: bookingDate && cDate.mom(bookingDate, null, 'DD/MM/YYYY'),
      grossPremium: numeric.printDecimal(netPremium),
      netPremium: numeric.printDecimal(netPremium),
      policyNumber,
      revDate: '',
      taxes: numeric.printDecimal(0),
    })
  }
  return {
    cL,
    number: 'ES2021/02',
    pDate: cDate.mom(null, null, 'DD/MM/YYYY'),
    refPeriod: '02/2021',
    totalEurGrossPr: numeric.printDecimal(totalEurNetPr),
    totalEurNetPr: numeric.printDecimal(totalEurNetPr),
    totalUsdGrossPr: numeric.printDecimal(totalUsdNetPr),
    totalUsdNetPr: numeric.printDecimal(totalUsdNetPr),
    type: 'MSC/AUSCOMAR',
  }
}
