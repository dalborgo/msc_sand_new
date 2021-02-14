import React, { memo, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FastField, Field, Form, Formik } from 'formik'
import { TextField } from 'formik-material-ui'
import { Box, Button, TextField as TF, Typography } from '@material-ui/core'
import { messages } from 'src/translations/messages'
import { useNewBookingStore } from 'src/zustandStore'
import { DatePicker } from '@material-ui/pickers'
import { initialState } from 'src/zustandStore/useCertificateStore'
import BookingAutocomplete from 'src/views/booking/NewBooking/BookingForm/BookingDataFields/BookingAutocomplete'
import { getCountryList, getPortList } from '@adapter/common/src/msc'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary } from './comps'

const { typesOfGoods } = useNewBookingStore.getState()
const FilterForm = memo(function FilterForm ({
  bookingDateFrom,
  bookingDateTo,
  bookingRef,
  countryPortDischarge,
  countryPortLoading,
  onSubmit,
  portDischarge,
  portLoading,
  typeOfGoods,
}) {
  console.log('%cRENDER_FORM', 'color: pink')
  const intl = useIntl()
  const isPortFiltersExpanded = useMemo(() => Boolean(countryPortDischarge || portDischarge || portLoading || countryPortLoading), [countryPortDischarge, countryPortLoading, portDischarge, portLoading])
  return (
    <Formik
      initialValues={
        {
          bookingDateFrom,
          bookingDateTo,
          bookingRef,
          countryPortLoading,
          countryPortDischarge,
          portLoading,
          portDischarge,
          typeOfGoods,
        }
      }
      onSubmit={onSubmit}
    >
      {
        ({ handleChange, dirty, setValues, values, setFieldValue }) => (
          <Form>
            <Box mb={3}>
              <FastField
                component={TextField}
                fullWidth
                label={intl.formatMessage(messages['certificates_column_booking_ref'])}
                name="bookingRef"
              />
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
            <Box mb={1.5}>
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
            <Accordion defaultExpanded={isPortFiltersExpanded}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
              >
                <Typography>
                  <FormattedMessage defaultMessage="Port filters" id="certificates.filters_port_group"/>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={3}>
                  <BookingAutocomplete
                    label={intl.formatMessage(messages['booking_country_port_loading'])}
                    list={getCountryList()}
                    name="countryPortLoading"
                    onChange={
                      (_, value) => {
                        setFieldValue('countryPortLoading', value)
                        setFieldValue('portLoading', null)
                      }
                    }
                  />
                </Box>
                <Box mb={3}>
                  <BookingAutocomplete
                    label={intl.formatMessage(messages['booking_port_loading'])}
                    list={getPortList(values['countryPortLoading']?.value)}
                    name="portLoading"
                    onChange={
                      (_, value) => {
                        setFieldValue('portLoading', value)
                      }
                    }
                  />
                </Box>
                <Box mb={3}>
                  <BookingAutocomplete
                    label={intl.formatMessage(messages['booking_country_port_discharge'])}
                    list={getCountryList()}
                    name="countryPortDischarge"
                    onChange={
                      (_, value) => {
                        setFieldValue('countryPortDischarge', value)
                        setFieldValue('portDischarge', null)
                      }
                    }
                  />
                </Box>
                <Box mb={0}>
                  <BookingAutocomplete
                    label={intl.formatMessage(messages['booking_port_discharge'])}
                    list={getPortList(values['countryPortDischarge']?.value)}
                    name="portDischarge"
                    onChange={
                      (_, value) => {
                        setFieldValue('portDischarge', value)
                      }
                    }
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Box display="flex" justifyContent="flex-end" mt={1.5}>
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
