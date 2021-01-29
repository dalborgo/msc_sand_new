import React, { memo, useMemo } from 'react'
import { FastField, Field } from 'formik'
import { Grid, InputAdornment, InputLabel, makeStyles, TextField as TF } from '@material-ui/core'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { Switch } from 'formik-material-ui'
import NumberFormatComp from 'src/components/NumberFormatComp'
import useAuth from 'src/hooks/useAuth'
import { numeric } from '@adapter/common'
import { getMinimumRate } from 'src/utils/logics'

const useStyles = makeStyles(theme => ({
  notchedOutline: {
    borderWidth: 1,
    borderColor: theme.palette.text.primary,
  },
}))

const rateHighlight = {
  fontWeight: 'bold',
}

const InsuranceDataFields = ({ handleChange, setFieldValue, minimumRateLabel, rate, bookingFromRef }) => {
  const intl = useIntl()
  const classes = useStyles()
  const { user: { priority } } = useAuth()
  const rateModified = useMemo(
    () => numeric.normNumb(rate) !== numeric.normNumb(minimumRateLabel),
    [minimumRateLabel, rate]
  )
  return (
    <Grid alignItems="center" container>
      <Grid item sm={6} style={{ paddingTop: 0 }} xs={12}>
        <InputLabel
          htmlFor="importantCustomer"
        >
          {intl.formatMessage(messages['booking_important_customer'])}
          <FastField
            component={Switch}
            name="importantCustomer"
            onChange={
              async event => {
                await handleChange(event)
                setFieldValue('rate', getMinimumRate(event.target.checked, bookingFromRef.current.values.reeferContainer))
              }
            }
            type="checkbox"
          />
        </InputLabel>
      </Grid>
      {
        priority > 2 &&
        <Grid item sm={6} xs={12}>
          <Field
            as={TF}
            fullWidth
            InputProps={
              {
                inputComponent: NumberFormatComp,
                inputProps: {
                  thousandSeparator: '.',
                  decimalScale: 3,
                  min: minimumRateLabel && priority === 3 ? numeric.normNumb(minimumRateLabel, false) : 0,
                  max: 100,
                },
                classes: {
                  notchedOutline: rateModified ? classes.notchedOutline : undefined,
                },
                style: rateModified ? rateHighlight : undefined,
                endAdornment:
                  (
                    <InputAdornment position="end">
                      <span style={rateModified ? rateHighlight : undefined}>%</span>
                    </InputAdornment>
                  ),
              }
            }
            label={
              priority === 3 ?
                intl.formatMessage(
                  messages['common_rate_min'],
                  { min: minimumRateLabel ? `${minimumRateLabel} %` : '' }
                )
                :
                intl.formatMessage(messages['common_rate_default'],
                  { default: minimumRateLabel ? `${minimumRateLabel} %` : '' }
                )
            }
            name="rate"
          />
        </Grid>
      }
      <Grid item xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_special_conditions'])}
          multiline
          name="specialConditions"
          rows={4}
          rowsMax={8}
        />
      </Grid>
    </Grid>
  )
}

export default memo(InsuranceDataFields)
