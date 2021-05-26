import React, { memo, useMemo } from 'react'
import { FastField, Field } from 'formik'
import { Grid, InputLabel, makeStyles, TextField as TF } from '@material-ui/core'
import NumberFormatComp from 'src/components/NumberFormatComp'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { Switch } from 'formik-material-ui'
import ToggleButton from '@material-ui/lab/ToggleButton'
import MandatoryToggleButtonGroup from 'src/utils/formik/MandatoryToggleButtonGroup'
import useNewBookingStore from 'src/zustandStore/useNewBookingStore'
import { getMinimumRate } from 'src/utils/logics'
import { numeric } from '@adapter/common'
import useAuth from 'src/hooks/useAuth'

const useStyles = makeStyles(theme => ({
  notchedOutline: {
    borderWidth: 1,
    borderColor: theme.palette.text.primary,
  },
}))

const goodsValueHighlight = {
  fontWeight: 'bold',
}

const { typesOfGoods } = useNewBookingStore.getState()
const ContainerDataFields = ({ handleChange, setFieldValue, maxGoodsValueLabel, goodsValue, bookingFromRef }) => {
  const intl = useIntl()
  const { user: { priority } } = useAuth()
  const classes = useStyles()
  const maxValueModified = useMemo(
    () => numeric.normNumb(goodsValue) > numeric.normNumb(maxGoodsValueLabel),
    [goodsValue, maxGoodsValueLabel]
  )
  return (
    <>
      <Grid alignItems="center" container>
        <Grid item sm={6} xs={12}>
          <FastField
            as={TF}
            fullWidth
            InputProps={
              {
                inputComponent: NumberFormatComp,
                inputProps: {
                  thousandSeparator: '.',
                  decimalScale: 0,
                },
              }
            }
            label={intl.formatMessage(messages['booking_number_containers'])}
            name="numberContainers"
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <FastField
            as={TF}
            fullWidth
            InputProps={
              {
                inputComponent: NumberFormatComp,
                inputProps: {
                  thousandSeparator: '.',
                  decimalScale: 2,
                },
              }
            }
            label={intl.formatMessage(messages['booking_goods_weight'])}
            name="goodsWeight"
          />
        </Grid>
        <Grid alignItems="center" container>
          <Grid item sm={6} xs={12}>
            <FastField
              as={TF}
              fullWidth
              label={intl.formatMessage(messages['booking_type_goods'])}
              name="typeOfGoods"
              onChange={
                event => {
                  handleChange(event)
                }
              }
              onFocus={() => null}
              required
              select
              SelectProps={{ native: true }}
            >
              <option
                key={''}
                value={''}
              />
              {
                typesOfGoods.map(({ value, key }) => {
                  return (
                    <option
                      key={key}
                      value={key}
                    >
                      {value}
                    </option>
                  )
                })
              }
            </FastField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <InputLabel
              htmlFor="reeferContainer"
              style={{ height: 20 }}
            >
              {intl.formatMessage(messages['booking_reefer_container'])}
              <FastField
                component={Switch}
                name="reeferContainer"
                onChange={
                  event => {
                    handleChange(event)
                    setFieldValue('rate', getMinimumRate(bookingFromRef.current.values.importantCustomer, event.target.checked))
                  }
                }
                type="checkbox"
              />
            </InputLabel>
            <InputLabel
              htmlFor="acceptedByMSC"
              style={{ whiteSpace: 'nowrap' }}
            >
              {intl.formatMessage(messages['accepted_by_msc'])}
              <FastField
                component={Switch}
                name="acceptedByMSC"
                required
                type="checkbox"
              />
            </InputLabel>
          </Grid>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Field
            as={TF}
            error={priority > 2 ? undefined : numeric.normNumb(goodsValue, false) > numeric.normNumb(maxGoodsValueLabel, false)}
            fullWidth
            InputProps={
              {
                inputComponent: NumberFormatComp,
                classes: {
                  notchedOutline: maxValueModified ? classes.notchedOutline : undefined,
                },
                style: (priority > 2 && maxValueModified) ? goodsValueHighlight : undefined,
                inputProps: {
                  thousandSeparator: '.',
                  decimalScale: 2,
                  max: priority > 2 ? undefined : numeric.normNumb(maxGoodsValueLabel, false),
                },
              }
            }
            label={intl.formatMessage(messages['booking_goods_value_max'], { max: maxGoodsValueLabel })}
            name="goodsValue"
            required
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <InputLabel
            htmlFor="currencyGoods"
          >
            {intl.formatMessage(messages['booking_currency_goods'])}
            <FastField
              component={MandatoryToggleButtonGroup}
              exclusive
              name="currencyGoods"
              size="small"
              style={{ marginLeft: 10 }}
              type="checkbox"
            >
              <ToggleButton disableRipple value="EUR">
                EUR
              </ToggleButton>
              <ToggleButton disableRipple value="USD">
                USD
              </ToggleButton>
            </FastField>
          </InputLabel>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <FastField
            as={TF}
            fullWidth
            label={intl.formatMessage(messages['booking_more_goods_details'])}
            multiline
            name="moreGoodsDetails"
            rows={4}
            rowsMax={8}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default memo(ContainerDataFields)
