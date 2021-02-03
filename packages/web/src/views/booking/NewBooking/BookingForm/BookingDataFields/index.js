import React, { memo, useCallback } from 'react'
import { FastField, Field } from 'formik'
import { Grid, TextField as TF } from '@material-ui/core'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import useNewBookingStore from 'src/zustandStore/useNewBookingStore'
import shallow from 'zustand/shallow'
import BookingAutocomplete from './BookingAutocomplete'
import { DatePicker } from '@material-ui/pickers'

const { countryList, insuranceTypes } = useNewBookingStore.getState()
const newBookingSelector = state => ({
  insuranceSelected: state.insuranceSelected,
  setInsuranceSelected: state.setInsuranceSelected,
  setLoadingPorts: state.setLoadingPorts,
  setDischargePorts: state.setDischargePorts,
  loadingPorts: state.loadingPorts,
  dischargePorts: state.dischargePorts,
})
const BookingDataFields = ({ handleChange, setFieldValue }) => {
  const intl = useIntl()
  const {
    insuranceSelected,
    setInsuranceSelected,
    setDischargePorts,
    loadingPorts,
    dischargePorts,
    setLoadingPorts,
  } = useNewBookingStore(newBookingSelector, shallow)
  const onCountryCollectionPointChange = useCallback((_, value) => {setFieldValue('countryCollectionPoint', value)}, [setFieldValue])
  const onCountryDeliveryPointChange = useCallback((_, value) => {setFieldValue('countryDeliveryPoint', value)}, [setFieldValue])
  const onPortLoadingChange = useCallback((_, value) => {setFieldValue('portLoading', value)}, [setFieldValue])
  const onPortDischargeChange = useCallback((_, value) => {setFieldValue('portDischarge', value)}, [setFieldValue])
  const onCountryPortLoadingChange = useCallback((_, value) => {
    setFieldValue('countryPortLoading', value)
    setFieldValue('portLoading', null)
    setLoadingPorts(value || {})
  }, [setFieldValue, setLoadingPorts])
  const onCountryPortDischargeChange = useCallback((_, value) => {
    setFieldValue('countryPortDischarge', value)
    setFieldValue('portDischarge', null)
    setDischargePorts(value || {})
  }, [setFieldValue, setDischargePorts])
  
  return (
    <Grid alignItems="center" container>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_msc_booking_ref'])}
          name="bookingRef"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          allowKeyboardControl
          as={DatePicker}
          emptyLabel="dd/mm/yyyy"
          format="DD/MM/YYYY"
          label={intl.formatMessage(messages['booking_booking_date'])}
          name="bookingDate"
          onChange={
            newValue => {
              setFieldValue('bookingDate', newValue)
            }
          }
          renderInput={
            props => {
              return <TF {...props} fullWidth helperText={null}/>
            }
          }
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_insurance_type'])}
          name="insuranceType"
          onChange={
            event => {
              handleChange(event)
              setInsuranceSelected(event?.target?.value)
              setFieldValue('cityDeliveryPoint', '')
              setFieldValue('cityCollectionPoint', '')
              setFieldValue('countryCollectionPoint', null)
              setFieldValue('countryDeliveryPoint', null)
              setFieldValue('countryPortDischarge', null)
              setFieldValue('countryPortLoading', null)
              setFieldValue('portDischarge', null)
              setFieldValue('portLoading', null)
            }
          }
          onFocus={() => null}
          select
          SelectProps={{ native: true }}
        >
          <option
            key={''}
            value={''}
          />
          {
            insuranceTypes.map(value => {
              return (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              )
            })
          }
        </FastField>
      </Grid>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_vessel_name_long'])}
          name="vesselName"
        />
      </Grid>
      {
        insuranceSelected.startsWith('door') &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_country_collection_point'])}
            list={countryList}
            name="countryCollectionPoint"
            onChange={onCountryCollectionPointChange}
          />
        </Grid>
      }
      {
        insuranceSelected.startsWith('door') &&
        <Grid item sm={6} xs={12}>
          <FastField
            as={TF}
            fullWidth
            label={intl.formatMessage(messages['booking_city_collection_point'])}
            name="cityCollectionPoint"
          />
        </Grid>
      }
      {
        (insuranceSelected.startsWith('door') || insuranceSelected.startsWith('port')) &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_country_port_loading'])}
            list={countryList}
            name="countryPortLoading"
            onChange={onCountryPortLoadingChange}
          />
        </Grid>
      }
      {
        (insuranceSelected.startsWith('door') || insuranceSelected.startsWith('port')) &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_port_loading'])}
            list={loadingPorts}
            name="portLoading"
            onChange={onPortLoadingChange}
          />
        </Grid>
      }
      {
        insuranceSelected.endsWith('door') &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_country_delivery_point'])}
            list={countryList}
            name="countryDeliveryPoint"
            onChange={onCountryDeliveryPointChange}
          />
        </Grid>
      }
      {
        insuranceSelected.endsWith('door') &&
        <Grid item sm={6} xs={12}>
          <FastField
            as={TF}
            fullWidth
            label={intl.formatMessage(messages['booking_city_delivery_point'])}
            name="cityDeliveryPoint"
          />
        </Grid>
      }
      {
        (insuranceSelected.endsWith('door') || insuranceSelected.endsWith('port')) &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_country_port_discharge'])}
            list={countryList}
            name="countryPortDischarge"
            onChange={onCountryPortDischargeChange}
          />
        </Grid>
      }
      {
        (insuranceSelected.endsWith('door') || insuranceSelected.endsWith('port')) &&
        <Grid item sm={6} xs={12}>
          <BookingAutocomplete
            label={intl.formatMessage(messages['booking_port_discharge'])}
            list={dischargePorts}
            name="portDischarge"
            onChange={onPortDischargeChange}
          />
        </Grid>
      }
    </Grid>
  )
}

export default memo(BookingDataFields)
