import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FastField, Field, Form, Formik } from 'formik'
import { Box, Button, TextField as TF } from '@material-ui/core'
import { messages } from 'src/translations/messages'
import { useNewBookingStore } from 'src/zustandStore'
import { DatePicker } from '@material-ui/pickers'
import { initialState } from 'src/zustandStore/useCertificateStore'

const { typesOfGoods } = useNewBookingStore.getState()
const FilterForm = memo(function FilterForm ({ typeOfGoods, bookingDateFrom, bookingDateTo, onSubmit }) {
  console.log('%cRENDER_FORM', 'color: pink')
  const intl = useIntl()
  return (
    <Formik
      initialValues={
        {
          typeOfGoods: typeOfGoods,
          bookingDateFrom: bookingDateFrom,
          bookingDateTo: bookingDateTo,
        }
      }
      onSubmit={onSubmit}
    >
      {
        ({ handleChange, dirty, setValues, values, setFieldValue }) => (
          <Form>
            <Box mb={3}>
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
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                <option
                  key={''}
                  value={''}
                />
                {
                  typesOfGoods.map(({ value, key }) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {value}
                    </option>
                  ))
                }
              </FastField>
            </Box>
            <Box mb={3}>
              <Field
                allowKeyboardControl
                allowSameDateSelection
                as={DatePicker}
                emptyLabel="dd/mm/yyyy"
                format="DD/MM/YYYY"
                label={intl.formatMessage(messages['certificates_filters_booking_date_from'])}
                name="bookingDateFrom"
                onChange={
                  newValue => {
                    setFieldValue('bookingDateFrom', newValue)
                  }
                }
                renderInput={
                  props => {
                    return <TF {...props} fullWidth helperText={null}/>
                  }
                }
              />
            </Box>
            <Box mb={3}>
              <Field
                allowKeyboardControl
                allowSameDateSelection
                as={DatePicker}
                emptyLabel="dd/mm/yyyy"
                format="DD/MM/YYYY"
                label={intl.formatMessage(messages['certificates_filters_booking_date_to'])}
                minDate={values['bookingDateFrom']}
                name="bookingDateTo"
                onChange={
                  newValue => {
                    setFieldValue('bookingDateTo', newValue)
                  }
                }
                renderInput={
                  props => {
                    return <TF {...props} fullWidth helperText={null}/>
                  }
                }
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mr={2}>
                <Button onClick={() => setValues(initialState.filter)} size="small" variant="contained">
                  <FormattedMessage defaultMessage="Clear" id="common.clear"/>
                </Button>
              </Box>
              <Box>
                <Button color="secondary" disabled={!dirty} size="small" type="submit" variant="contained">
                  <FormattedMessage defaultMessage="Apply" id="common.apply"/>
                </Button>
              </Box>
            </Box>
          </Form>
        )
      }
    </Formik>
  )
})

export default FilterForm
