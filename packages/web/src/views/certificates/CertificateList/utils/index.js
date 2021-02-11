import { messages } from 'src/translations/messages'
import ExcelJS from 'exceljs'
import { ctol } from 'src/utils/formatters'
import saveAs from 'file-saver'
import moment from 'moment'
import { getTypeOfGood } from '@adapter/common/src/msc'
import { numeric } from '@adapter/common'
/*export const getConfirmExportText = (values, intl) =>
  intl.formatMessage(messages['booking_confirm_save']) + '<br/><br/>' +
  intl.formatMessage(messages['booking_important_customer']) + ': <strong>' + (values.importantCustomer ? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no'])) + '</strong><br/>' +
  intl.formatMessage(messages['booking_reefer_container']) + ': <strong>' + (values.reeferContainer? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no'])) + '</strong><br/>' +
  intl.formatMessage(messages['common_rate']) + ': <strong>' + values.rate + ' %</strong>'*/
export const getConfirmExportText = (filter, intl) => {
  let str = ''
  const { typeOfGoods, bookingDateFrom, bookingDateTo } = filter
  str += intl.formatMessage(messages['certificates_confirm_export_text']) + '<br/>'
  if (typeOfGoods) {
    str += intl.formatMessage(messages['booking_type_goods']) + ': <strong>' + getTypeOfGood(typeOfGoods)?.value + '</strong><br/>'
  }
  if (bookingDateFrom) {
    str += intl.formatMessage(messages['certificates_filters_booking_date_from']) + ': <strong>' + moment(bookingDateFrom).format('DD/MM/YYYY') + '</strong><br/>'
  }
  if (bookingDateTo) {
    str += intl.formatMessage(messages['certificates_filters_booking_date_to']) + ': <strong>' + moment(bookingDateTo).format('DD/MM/YYYY') + '</strong><br/>'
  }
  return str
}

const bold = { font: { bold: true } }
const right = { alignment: { horizontal: 'right' } }
const center = { alignment: { horizontal: 'center' } }
const lightBlue = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'CEDFE4' } } }

export const exportContainers = (rows, filter, intl, isBooking) => {
  const fileName = isBooking ? 'booking-export' : 'containers-export'
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Export')
  const columns = [
    { key: 'policyNumber', width: 25 },
    { key: 'bookingRef', width: 25 },
    { key: 'numberContainers', width: 15 },
    { key: 'bookingDate', width: 15, style: { numFmt: 'dd/mm/yyyy' } },
    { key: 'currencyGoods', width: 15 },
    { key: 'typeOfGoods', width: 25 },
    { key: 'goodsValue', width: 20, style: { numFmt: '#,##0.00' } },
    { key: 'goodsWeight', width: 20, style: { numFmt: '#,##0.00' } },
  ]
  ws.columns = columns
  const letter = ctol(columns)
  ws.addRow({ policyNumber: isBooking ? intl.formatMessage(messages['certificates_export_booking']) : intl.formatMessage(messages['certificates_export_containers']) })
  Object.assign(ws.getRow(1).getCell(1), bold)
  let gap = 1, first = true
  for (let key in filter) {
    if (filter[key]) {
      if (first) {
        ws.addRow({ policyNumber: intl.formatMessage(messages['common_filters']) })
        first = false
        gap++
        Object.assign(ws.getRow(gap).getCell(1), lightBlue)
      }
      if (key === 'typeOfGoods') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['booking_type_goods']) + ':',
          bookingRef: getTypeOfGood(filter[key])?.value,
        })
        Object.assign(ws.getRow(gap).getCell(2), bold, lightBlue)
      }
      if (key === 'bookingDateFrom') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['certificates_filters_booking_date_from']) + ':',
          bookingRef: filter[key] && moment(filter[key]).format('DD/MM/YYYY'),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold, lightBlue)
      }
      if (key === 'bookingDateTo') {
        gap++
        ws.addRow({
          policyNumber: intl.formatMessage(messages['certificates_filters_booking_date_to']) + ':',
          bookingRef: filter[key] && moment(filter[key]).format('DD/MM/YYYY'),
        })
        Object.assign(ws.getRow(gap).getCell(2), bold, lightBlue)
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
    numberContainers: intl.formatMessage(messages['certificates_export_number_containers']),
    bookingDate: intl.formatMessage(messages['booking_booking_date']),
    currencyGoods: intl.formatMessage(messages['certificates_export_currency']),
    typeOfGoods: intl.formatMessage(messages['booking_type_goods']),
    goodsValue: intl.formatMessage(messages['booking_goods_value']),
    goodsWeight: intl.formatMessage(messages['booking_goods_weight']),
  })
  const alignCenterCols = ['bookingDate', 'currencyGoods']
  const alignRightCols = ['goodsValue', 'numberContainers', 'goodsWeight']
  for (let colIndex = 1; colIndex <= columns.length; colIndex += 1) {
    if (alignRightCols.includes(columns[colIndex - 1].key)) {
      Object.assign(ws.getColumn(colIndex), right)
    }
    if (alignCenterCols.includes(columns[colIndex - 1].key)) {
      Object.assign(ws.getColumn(colIndex), center)
    }
    Object.assign(ws.getRow(gap + 1).getCell(colIndex), lightBlue)
  }
  for (let row of rows) {
    const bookingRow = {
      policyNumber: row.policyNumber,
      bookingRef: row.bookingRef,
      numberContainers: row.numberContainers || 0,
      bookingDate: row.bookingDate && new Date(row.bookingDate),
      currencyGoods: row.currencyGoods,
      typeOfGoods: getTypeOfGood(row.typeOfGoods)?.value,
      goodsValue: numeric.toFloat((row.goodsValue / 1000) || 0),
      goodsWeight: numeric.toFloat((row.goodsWeight / 1000) || 0),
    }
    if (isBooking) {
      ws.addRow(bookingRow)
    } else {
      for (let index = 1; index <= bookingRow.numberContainers; index += 1) {
        ws.addRow({
          ...bookingRow,
          numberContainers: 1,
          goodsValue: bookingRow.goodsValue / bookingRow.numberContainers,
          goodsWeight: bookingRow.goodsWeight / bookingRow.numberContainers,
        })
      }
    }
  }
  workbook.xlsx.writeBuffer().then(buffer => {
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
  })
}
