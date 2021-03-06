import React, { memo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FastField, Field, Form, Formik } from 'formik'
import { TextField } from 'formik-material-ui'
import { Box, Button, Grid, InputLabel, makeStyles, TextField as TF, Typography } from '@material-ui/core'
import { messages } from 'src/translations/messages'
import { useNewBookingStore } from 'src/zustandStore'
import { DatePicker } from '@material-ui/pickers'
import { initialState } from 'src/zustandStore/useCertificateStore'
import BookingAutocomplete from 'src/components/BookingAutocomplete'
import { getPortList, getCountryListForPorts } from '@adapter/common/src/msc'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary } from './comps'
import NumberFormatComp from 'src/components/NumberFormatComp'
import MandatoryToggleButtonGroup from 'src/utils/formik/MandatoryToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import useAuth from 'src/hooks/useAuth'

const useStyles = makeStyles((theme) => ({
  toggleButton: {
    fontSize: theme.typography.pxToRem(11),
    padding: theme.spacing(0.8, 0.8),
  },
  lastAccordion: {
    marginBottom: theme.spacing(2),
  },
}))

const { typesOfGoods } = useNewBookingStore.getState()
const FilterForm = memo(function FilterForm (props) {
  const { onSubmit, ...filters } = props
  const classes = useStyles()
  const { user: { priority } } = useAuth()
  const intl = useIntl()
  const [isPortFiltersExpanded] = useState(Boolean(filters.countryPortDischarge || filters.portDischarge || filters.portLoading || filters.countryPortLoading))
  const [isValueFiltersExpanded] = useState(Boolean(filters.minGoodsValue || filters.maxGoodsValue || filters.typeRate || filters.typeGoodsValue))
  return (
    <Formik
      initialValues={filters}
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
            <Box display="flex" gridGap={15} mb={3}>
              <Field
                allowKeyboardControl
                allowSameDateSelection
                as={DatePicker}
                emptyLabel="dd/mm/yyyy"
                format="DD/MM/YYYY"
                label={intl.formatMessage(messages['certificates_filters_creation_date_from'])}
                name="creationDateFrom"
                onChange={
                  newValue => {
                    setFieldValue('creationDateFrom', newValue)
                  }
                }
                renderInput={
                  props => {
                    return <TF {...props} helperText={null}/>
                  }
                }
              />
              <Field
                allowKeyboardControl
                allowSameDateSelection
                as={DatePicker}
                emptyLabel="dd/mm/yyyy"
                format="DD/MM/YYYY"
                label={intl.formatMessage(messages['certificates_filters_creation_date_to'])}
                minDate={values['creationDateFrom']}
                name="creationDateTo"
                onChange={
                  newValue => {
                    setFieldValue('creationDateTo', newValue)
                  }
                }
                renderInput={
                  props => {
                    return <TF {...props} helperText={null}/>
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
                    list={getCountryListForPorts()}
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
                    list={getCountryListForPorts()}
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
            <Accordion className={classes.lastAccordion} defaultExpanded={isValueFiltersExpanded}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
              >
                <Typography>
                  <FormattedMessage defaultMessage="Value filters" id="certificates.filters_value_group"/>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.lastAccordion}>
                <Box>
                  <Grid alignItems="center" container spacing={1}>
                    <Grid item xs={4}>
                      <InputLabel>
                        {intl.formatMessage(messages['certificates_filter_value_goods'])}
                      </InputLabel>
                    </Grid>
                    <Grid item xs={4}>
                      <FastField
                        as={TF}
                        InputProps={
                          {
                            inputComponent: NumberFormatComp,
                            inputProps: {
                              thousandSeparator: '.',
                              decimalScale: 2,
                            },
                          }
                        }
                        label={intl.formatMessage(messages['certificates_filter_min'])}
                        name="minGoodsValue"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FastField
                        as={TF}
                        InputProps={
                          {
                            inputComponent: NumberFormatComp,
                            inputProps: {
                              thousandSeparator: '.',
                              decimalScale: 2,
                            },
                          }
                        }
                        label={intl.formatMessage(messages['certificates_filter_max'])}
                        name="maxGoodsValue"
                      />
                    </Grid>
                  </Grid>
                </Box>
                {
                  priority === 4 &&
                  <Box mt={1}>
                    <Grid alignItems="center" container spacing={1}>
                      <Grid item xs={4}>
                        <InputLabel>
                          {intl.formatMessage(messages['certificates_filter_value_goods'])}
                        </InputLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <FastField
                          component={MandatoryToggleButtonGroup}
                          exclusive
                          name="typeGoodsValue"
                          size="small"
                          type="checkbox"
                        >
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value=""
                          >
                            {intl.formatMessage(messages['common_all'])}
                          </ToggleButton>
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value="exception"
                          >
                            {intl.formatMessage(messages['certificates_filter_exception'])}
                          </ToggleButton>
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value="not_exception"
                          >
                            {intl.formatMessage(messages['certificates_filter_not_exception'])}
                          </ToggleButton>
                        </FastField>
                      </Grid>
                    </Grid>
                  </Box>
                }
                {
                  priority === 4 &&
                  <Box mt={1}>
                    <Grid alignItems="center" container spacing={1}>
                      <Grid item xs={4}>
                        <InputLabel>
                          {intl.formatMessage(messages['common_rate'])}
                        </InputLabel>
                      </Grid>
                      <Grid item xs={8}>
                        <FastField
                          component={MandatoryToggleButtonGroup}
                          exclusive
                          name="typeRate"
                          size="small"
                          type="checkbox"
                        >
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value=""
                          >
                            {intl.formatMessage(messages['common_all'])}
                          </ToggleButton>
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value="exception"
                          >
                            {intl.formatMessage(messages['certificates_filter_exception'])}
                          </ToggleButton>
                          <ToggleButton
                            classes={{ sizeSmall: classes.toggleButton }}
                            disableRipple
                            value="not_exception"
                          >
                            {intl.formatMessage(messages['certificates_filter_not_exception'])}
                          </ToggleButton>
                        </FastField>
                      </Grid>
                    </Grid>
                  </Box>
                }
              </AccordionDetails>
            </Accordion>
            <Box display="flex" justifyContent="flex-end" mt={0}>
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
