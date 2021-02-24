import { messages } from 'src/translations/messages'
import ExcelJS from 'exceljs'
import saveAs from 'file-saver'
import moment from 'moment'
import { getTypeOfGood } from '@adapter/common/src/msc'
import { numeric } from '@adapter/common'

export const getConfirmExportText = (filter, intl) => {
  let str = ''
  const {
    bookingRef,
    portLoading,
    typeOfGoods,
    bookingDateFrom,
    bookingDateTo,
    countryPortLoading,
    portDischarge,
    countryPortDischarge
  } = filter
  str += `${intl.formatMessage(messages['certificates_confirm_export_text'])}<br/>`
  if (bookingRef) {
    str += `${intl.formatMessage(messages['certificates_column_booking_ref'])}: <strong>${bookingRef}</strong><br/>`
  }
  if (bookingDateFrom) {
    str += `${intl.formatMessage(messages['certificates_filters_booking_date_from'])}: <strong>${moment(bookingDateFrom).format('DD/MM/YYYY')}</strong><br/>`
  }
  if (bookingDateTo) {
    str += `${intl.formatMessage(messages['certificates_filters_booking_date_to'])}: <strong>${moment(bookingDateTo).format('DD/MM/YYYY')}</strong><br/>`
  }
  if (typeOfGoods) {
    str += `${intl.formatMessage(messages['booking_type_goods'])}: <strong>${getTypeOfGood(typeOfGoods)?.value}</strong><br/>`
  }
  if (countryPortLoading) {
    str += `${intl.formatMessage(messages['booking_country_port_loading'])}: <strong>${countryPortLoading.value}</strong><br/>`
  }
  if (portLoading) {
    str += `${intl.formatMessage(messages['booking_port_loading'])}: <strong>${portLoading.value}${portLoading.key ? ` (${portLoading.key})` : ''}</strong><br/>`
  }
  if (countryPortDischarge) {
    str += `${intl.formatMessage(messages['booking_country_port_discharge'])}: <strong>${countryPortDischarge.value}</strong><br/>`
  }
  if (portDischarge) {
    str += `${intl.formatMessage(messages['booking_port_discharge'])}: <strong>${portDischarge.value}${portDischarge.key ? ` (${portDischarge.key})` : ''}</strong><br/>`
  }
  return str
}

const bold = { font: { bold: true } }
const right = { alignment: { horizontal: 'right', vertical: 'middle' } }
const center = { alignment: { horizontal: 'center', vertical: 'middle' } }
const normal = { alignment: { vertical: 'middle' } }
const wrap = { alignment: { wrapText: true } }
const lightBlue = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CEDFE4' } } }

export const exportContainers = (rows, filter, intl, isBooking, priority) => {
  const fileName = isBooking ? 'booking-export' : 'containers-export'
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Export')
  const columns = [
    { key: 'policyNumber', width: 25 },
    { key: 'bookingRef', width: 25 },
    { key: 'numberContainers', width: 15 },
    { key: 'bookingDate', width: 15, style: { numFmt: 'dd/mm/yyyy' } },
    { key: 'currencyGoods', width: 15 },
    { key: 'goodsValue', width: 20, style: { numFmt: '#,##0.00' } },
    { key: 'typeOfGoods', width: 25 },
    { key: 'goodsWeight', width: 20, style: { numFmt: '#,##0.00' } },
    { key: 'rate', width: 20, style: { numFmt: '#,##0.000' } },
    { key: 'insuranceType', width: 20 },
    { key: 'importantCustomer', width: 20 },
    { key: 'reeferContainer', width: 20 },
    { key: 'sender', width: 25 },
    { key: 'recipients', width: 25 },
    { key: 'vesselName', width: 20 },
    { key: 'countryCollectionPoint', width: 25 },
    { key: 'cityCollectionPoint', width: 25 },
    { key: 'countryDeliveryPoint', width: 25 },
    { key: 'cityDeliveryPoint', width: 25 },
    { key: 'from', width: 25 },
    { key: 'to', width: 25 },
    { key: 'netPremium', width: 15, style: { numFmt: '#,##0.00' } },
    { key: 'brokerFees', width: 15, style: { numFmt: '#,##0.00' } },
    { key: 'muwCommission', width: 15, style: { numFmt: '#,##0.00' } },
    { key: 'moreGoodsDetails', width: 25 },
    { key: 'specialConditions', width: 25 },
  ]
  if (priority < 3) {columns.splice(8, 1)} // rate
  ws.columns = columns
  ws.addRow({ policyNumber: isBooking ? intl.formatMessage(messages['certificates_booking_export']) : intl.formatMessage(messages['certificates_containers_export']) })
  Object.assign(ws.getRow(1).getCell(1), bold)
  let gap = 1, first = true
  for (let key in filter) {
    if (filter[key]) {
      if (first) {
        ws.addRow({ policyNumber: intl.formatMessage(messages['common_filters']) })
        first = false
        gap++
        Object.assign(ws.getRow(gap).getCell(1), lightBlue)
        Object.assign(ws.getRow(gap).getCell(2), lightBlue)
      }
      if (key === 'bookingRef') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['certificates_column_booking_ref']) + ':',
          bookingRef: filter[key],
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'bookingDateFrom') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['certificates_filters_booking_date_from']) + ':',
          bookingRef: filter[key] && moment(filter[key]).format('DD/MM/YYYY'),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'bookingDateTo') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['certificates_filters_booking_date_to']) + ':',
          bookingRef: filter[key] && moment(filter[key]).format('DD/MM/YYYY'),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'typeOfGoods') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_type_goods']) + ':',
          bookingRef: getTypeOfGood(filter[key])?.value,
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'countryPortLoading') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_country_port_loading']) + ':',
          bookingRef: filter[key]?.value,
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'portLoading') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_port_loading']) + ':',
          bookingRef: filter[key]?.value + '' + (filter[key]?.key ? ' (' + filter[key]?.key + ')' : ''),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'countryPortDischarge') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_country_port_discharge']) + ':',
          bookingRef: filter[key]?.value,
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
      if (key === 'portDischarge') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_port_discharge']) + ':',
          bookingRef: filter[key]?.value + '' + (filter[key]?.key ? ' (' + filter[key]?.key + ')' : ''),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold)
      }
    }
  }
  if (gap > 1) {
    ws.addRow({})
    gap++
  }
  ws.addRow({
    policyNumber: intl.formatMessage(messages['certificates_column_policy_number']),
    bookingRef: intl.formatMessage(messages['certificates_column_booking_ref']),
    numberContainers: isBooking ? intl.formatMessage(messages['certificates_export_number_containers']) : intl.formatMessage(messages['certificates_container_id']),
    bookingDate: intl.formatMessage(messages['booking_booking_date']),
    currencyGoods: intl.formatMessage(messages['certificates_export_currency']),
    goodsValue: intl.formatMessage(messages['booking_goods_value']),
    typeOfGoods: intl.formatMessage(messages['booking_type_goods']),
    goodsWeight: intl.formatMessage(messages['booking_goods_weight']),
    rate: intl.formatMessage(messages['common_rate']),
    insuranceType: intl.formatMessage(messages['booking_insurance_type']),
    reeferContainer: intl.formatMessage(messages['booking_reefer_container']),
    importantCustomer: intl.formatMessage(messages['booking_important_customer']),
    sender: intl.formatMessage(messages['booking_sender']),
    recipients: intl.formatMessage(messages['booking_recipient']),
    vesselName: intl.formatMessage(messages['booking_vessel_name']),
    countryCollectionPoint: intl.formatMessage(messages['booking_country_collection_point']),
    cityCollectionPoint: intl.formatMessage(messages['booking_country_collection_point']),
    countryDeliveryPoint: intl.formatMessage(messages['booking_country_delivery_point']),
    cityDeliveryPoint: intl.formatMessage(messages['booking_city_delivery_point']),
    from: intl.formatMessage(messages['booking_country_plus_port_loading']),
    to: intl.formatMessage(messages['booking_country_plus_port_discharge']),
    netPremium: intl.formatMessage(messages['certificates_export_net_prize']),
    brokerFees: intl.formatMessage(messages['certificates_export_broker_fees']),
    muwCommission: intl.formatMessage(messages['certificates_export_muw_commission']),
    moreGoodsDetails: intl.formatMessage(messages['booking_more_goods_details']),
    specialConditions: intl.formatMessage(messages['booking_special_conditions']),
  })
  const alignCenterCols = ['bookingDate', 'currencyGoods', 'importantCustomer', 'typeOfGoods', 'insuranceType', 'reeferContainer']
  // tieni numberContainers ultimo
  const alignRightCols = ['goodsValue', 'rate', 'goodsWeight', 'netPremium', 'muwCommission', 'brokerFees', 'numberContainers']
  if (!isBooking) {alignRightCols.pop()}
  const alignWrapCols = ['specialConditions', 'moreGoodsDetails']
  for (let colIndex = 1; colIndex <= columns.length; colIndex += 1) {
    if (alignRightCols.includes(columns[colIndex - 1].key)) {
      Object.assign(ws.getColumn(colIndex), right)
    } else if (alignCenterCols.includes(columns[colIndex - 1].key)) {
      Object.assign(ws.getColumn(colIndex), center)
    } else if (alignWrapCols.includes(columns[colIndex - 1].key)) {
      Object.assign(ws.getColumn(colIndex), wrap)
    } else {
      Object.assign(ws.getColumn(colIndex), normal)
    }
    Object.assign(ws.getRow(gap + 1).getCell(colIndex), lightBlue)
  }
  let bookingRefPrev = '', containerCount = 1
  for (let row of rows) {
    const goodsValue = numeric.toFloat((row.goodsValue / 1000) || 0)
    const rate = numeric.toFloat((row.rate / 1000) || 0)
    const netPremium = goodsValue * rate / 100
    const bookingRow = {
      policyNumber: row.policyNumber,
      bookingRef: row.bookingRef,
      numberContainers: row.numberContainers || 0,
      bookingDate: row.bookingDate && new Date(row.bookingDate),
      currencyGoods: row.currencyGoods,
      goodsValue,
      typeOfGoods: getTypeOfGood(row.typeOfGoods)?.value,
      goodsWeight: numeric.toFloat((row.goodsWeight / 1000) || 0),
      rate,
      insuranceType: row.insuranceType,
      importantCustomer: row.importantCustomer ? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no']),
      reeferContainer: row.reeferContainer ? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no']),
      sender: row.sender,
      recipients: row.recipients.join(', '),
      vesselName: row.vesselName,
      countryCollectionPoint: row.countryCollectionPoint?.value,
      cityCollectionPoint: row.cityCollectionPoint,
      countryDeliveryPoint: row?.countryDeliveryPoint?.value,
      cityDeliveryPoint: row.cityDeliveryPoint,
      from: `${row?.countryPortLoading?.value ?? ''}${row.portLoading?.value ? ` - ${row.portLoading?.value}` : ''}${row.portLoading?.key ? ` (${row.portLoading?.key})` : ''}`,
      to: `${row?.countryPortDischarge?.value ?? ''}${row.portDischarge?.value ? ` - ${row.portDischarge?.value}` : ''}${row.portDischarge?.key ? ` (${row.portDischarge?.key})` : ''}`,
      netPremium,
      brokerFees: netPremium / 2,
      muwCommission: netPremium * 2 / 100,
      moreGoodsDetails: row.moreGoodsDetails,
      specialConditions: row.specialConditions,
    }
    if (isBooking) {
      ws.addRow(bookingRow)
    } else {
      for (let index = 1; index <= bookingRow.numberContainers; index += 1) {
        if (bookingRefPrev === row.bookingRef) {
          containerCount++
        } else {
          containerCount = 1
        }
        bookingRefPrev = row.bookingRef
        ws.addRow({
          ...bookingRow,
          numberContainers: `${intl.formatMessage(messages['certificates_export_container_no'])} ${containerCount}`,
          goodsValue: bookingRow.goodsValue / bookingRow.numberContainers,
          goodsWeight: bookingRow.goodsWeight / bookingRow.numberContainers,
          netPremium: bookingRow.netPremium / bookingRow.numberContainers,
          brokerFees: bookingRow.brokerFees / bookingRow.numberContainers,
          muwCommission: bookingRow.muwCommission / bookingRow.numberContainers,
        })
      }
    }
  }
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
  })
}
