import React from 'react'
import { Divider, Grid, makeStyles, Typography, withStyles } from '@material-ui/core'
import moment from 'moment'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import clsx from 'clsx'
import { numeric } from '@adapter/common'
import { getTypeOfGood } from '@adapter/common/src/msc'
import isNumber from 'lodash/isNumber'
import useAuth from 'src/hooks/useAuth'

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(1.5, 0),
  },
}))

const typoStyle = theme => ({
  root: {
    fontWeight: props => props.bold ? 'bold' : 'normal',
    marginBottom: props => props.mb ? theme.spacing(isNumber(props.mb) || 1) : 0,
    marginTop: props => theme.spacing(props.mt || 0),
  },
  red: {
    color: theme.palette.error.main,
  },
})
const Typo = withStyles(typoStyle)(props => {
  const { children, classes } = props
  return (
    <Typography
      className={clsx(classes.root, { [classes.red]: !children })}
      variant="body2"
    >{children || 'XXX'}
    </Typography>
  )
})

function DataLayout ({ values }) {
  const { user: { priority } } = useAuth()
  const classes = useStyles()
  const intl = useIntl()
  return (
    <>
      <Grid container justify="space-between">
        <Grid item sm="auto" xs={12}>
          <Typo>
            {intl.formatMessage(messages['booking_sender'])}
          </Typo>
          <Typo bold mb>
            {values.sender}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_recipient'])}
          </Typo>
          {
            values.recipients?.map((recipient, index) => {
              return (
                <Typo bold key={index}>
                  {recipient}
                </Typo>
              )
            })
          }
        </Grid>
        <Grid item sm="auto" xs={12}>
          <Typo>
            {intl.formatMessage(messages['booking_booking_date'])}
          </Typo>
          <Typo bold mb>
            {values.bookingDate ? moment(values.bookingDate).format('DD/MM/YYYY') : ''}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_msc_booking_ref'])}
          </Typo>
          <Typo bold mb>
            {values.bookingRef}
          </Typo>
        </Grid>
      </Grid>
      <Divider className={classes.divider}/>
      <Grid container justify="space-between">
        <Grid item sm="auto" xs={12}>
          <Typo>
            {intl.formatMessage(messages['booking_goods_weight'])}
          </Typo>
          <Typo bold mb>
            {values.goodsWeight ? numeric.printDecimal(values.goodsWeight / 1000, 0) : ''}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_number_container'])}
          </Typo>
          <Typo bold mb>
            {values.numberContainers}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_reefer_container'])}
          </Typo>
          <Typo bold mb>
            {values.reeferContainer ? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no'])}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_type_goods'])}
          </Typo>
          <Typo bold mb>
            {values.typeOfGoods ? getTypeOfGood(values.typeOfGoods)?.value : ''}
          </Typo>
        </Grid>
        <Grid item sm="auto" xs={12}>
          {
            values.insuranceType &&
            <>
              {
                values.insuranceType.startsWith('door') &&
                <>
                  <Typo>
                    {intl.formatMessage(messages['booking_country_collection_point'])}
                  </Typo>
                  <Typo bold mb>
                    {values.countryCollectionPoint ? `${values.countryCollectionPoint?.value} - ${values.cityCollectionPoint}` : ''}
                  </Typo>
                </>
              }
              {
                (values.insuranceType.startsWith('door') || values.insuranceType.startsWith('port')) &&
                <>
                  <Typo>
                    {intl.formatMessage(messages['booking_country_plus_port_loading'])}
                  </Typo>
                  <Typo bold>
                    {values.countryPortLoading ? values.countryPortLoading?.value : ''}
                  </Typo>
                  <Typo bold mb>
                    {values.portLoading ? `${values.portLoading?.value} (${values.portLoading?.key})` : ''}
                  </Typo>
                </>
              }
              {
                values.insuranceType.endsWith('door') &&
                <>
                  <Typo>
                    {intl.formatMessage(messages['booking_country_delivery_point'])}
                  </Typo>
                  <Typo bold mb>
                    {values.countryDeliveryPoint ? `${values.countryDeliveryPoint?.value} - ${values.cityDeliveryPoint}` : ''}
                  </Typo>
                </>
              }
              {
                (values.insuranceType.endsWith('door') || values.insuranceType.endsWith('port')) &&
                <>
                  <Typo>
                    {intl.formatMessage(messages['booking_country_plus_port_discharge'])}
                  </Typo>
                  <Typo bold>
                    {values.countryPortDischarge ? values.countryPortDischarge?.value : ''}
                  </Typo>
                  <Typo bold mb>
                    {values.portDischarge ? `${values.portDischarge?.value} (${values.portDischarge?.key})` : ''}
                  </Typo>
                </>
              }
              <Typo>
                {intl.formatMessage(messages['booking_insurance_type'])}
              </Typo>
              <Typo bold mb>
                {values.insuranceType}
              </Typo>
            </>
          }
          {
            values.vesselName &&
            <>
              <Typo>
                {intl.formatMessage(messages['booking_vessel_name'])}
              </Typo>
              <Typo bold mb>
                {values.vesselName}
              </Typo>
            </>
          }
        </Grid>
        {
          values.moreGoodsDetails &&
          <Grid item xs={12}>
            <Typo>
              {intl.formatMessage(messages['booking_more_goods_details'])}
            </Typo>
            {
              (values.moreGoodsDetails.split('\n')).map((row, index) => (
                <Typo bold key={index} mb={index === values.moreGoodsDetails.length - 1}>
                  {row || ' '}
                </Typo>
              ))
            }
          </Grid>
        }
      </Grid>
      <Divider className={classes.divider}/>
      <Grid container justify="space-between">
        <Grid item sm="auto" xs={12}>
          <Typo>
            {intl.formatMessage(messages['booking_goods_value'])}
          </Typo>
          <Typo bold mb>
            {values.goodsValue ? numeric.printDecimal(values.goodsValue / 1000) : ''}
          </Typo>
          <Typo>
            {intl.formatMessage(messages['booking_important_customer'])}
          </Typo>
          <Typo bold mb>
            {values.importantCustomer ? intl.formatMessage(messages['common_yes']) : intl.formatMessage(messages['common_no'])}
          </Typo>
        </Grid>
        <Grid item sm="auto" xs={12}>
          <Typo>
            {intl.formatMessage(messages['booking_currency_goods'])}
          </Typo>
          <Typo bold mb>
            {values.currencyGoods}
          </Typo>
          {
            priority > 2 &&
            <>
              <Typo>
                {intl.formatMessage(messages['common_rate'])}
              </Typo>
              <Typo bold mb>
                {values.rate ? `${numeric.printDecimal(values.rate / 1000, 3)} %` : ''}
              </Typo>
            </>
          }
        </Grid>
        {
          values.specialConditions &&
          <Grid item xs={12}>
            <Typo>
              {intl.formatMessage(messages['booking_special_conditions'])}
            </Typo>
            {
              (values.specialConditions.split('\n')).map((row, index) => (
                <Typo bold key={index} mb>
                  {row || ' '}
                </Typo>
              ))
            }
          </Grid>
        }
      </Grid>
    </>
  )
}

export default DataLayout
