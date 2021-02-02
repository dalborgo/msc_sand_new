import React, { memo, useMemo } from 'react'
import { Card, makeStyles, Typography } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import ContainerDataFields from './ContainerDataFields'
import { useFormikContext } from 'formik'
import HeaderDataFields from './HeaderDataFields'
import BookingDataFields from './BookingDataFields'
import InsuranceDataFields from './InsuranceDataFields'
import useAuth from 'src/hooks/useAuth'
import { getMaxGoodsValue, getMinimumRate } from 'src/utils/logics'

const useStyles = makeStyles(theme => ({
  divContainer: {
    paddingRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: { //mobile
      paddingRight: theme.spacing(0),
    },
    '& .MuiInputLabel-root': {
      marginTop: 2,
      fontSize: '0.9rem',
    },
    '& .MuiOutlinedInput-multiline, .MuiOutlinedInput-adornedEnd, .MuiAutocomplete-root, .MuiInputBase-input ': {
      backgroundColor: theme.palette.background.dark,
    },
    '& .MuiSwitch-root': {
      marginTop: -2,
    },
    '& .MuiCard-root': {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    '& .MuiGrid-item': {
      padding: theme.spacing(1.5, 1, 1.5, 1),
    },
  },
}))

const BookingForm = ({ bookingFromRef }) => {
  const classes = useStyles()
  const { handleChange, setFieldValue, values } = useFormikContext()
  const { user: { priority } } = useAuth()
  const minimumRateLabel = useMemo(() => priority > 2 ? getMinimumRate(values.importantCustomer, values.reeferContainer) : '',
    [priority, values.importantCustomer, values.reeferContainer])
  const maxGoodsValueLabel = useMemo(() => getMaxGoodsValue(values.reeferContainer, values.currencyGoods),
    [values.currencyGoods, values.reeferContainer])
  return (
    <div className={classes.divContainer} id="bookingForm">
      <Typography color="secondary" gutterBottom>
        <FormattedMessage defaultMessage="Header data" id="booking.header_data"/>
      </Typography>
      <Card>
        <HeaderDataFields recipients={values.recipients}/>
      </Card>
      <Typography color="secondary" gutterBottom>
        <FormattedMessage defaultMessage="Container data" id="booking.container_data"/>
      </Typography>
      <Card>
        <ContainerDataFields
          bookingFromRef={bookingFromRef}
          goodsValue={values.goodsValue}
          handleChange={handleChange}
          maxGoodsValueLabel={maxGoodsValueLabel}
          setFieldValue={setFieldValue}
        />
      </Card>
      <Typography color="secondary" gutterBottom>
        <FormattedMessage defaultMessage="Booking data" id="booking.booking_data"/>
      </Typography>
      <Card>
        <BookingDataFields handleChange={handleChange} setFieldValue={setFieldValue}/>
      </Card>
      <Typography color="secondary" gutterBottom>
        <FormattedMessage defaultMessage="Insurance data" id="booking.insurance_data"/>
      </Typography>
      <Card>
        <InsuranceDataFields
          bookingFromRef={bookingFromRef}
          handleChange={handleChange}
          minimumRateLabel={minimumRateLabel}
          rate={values.rate}
          setFieldValue={setFieldValue}
        />
      </Card>
    </div>
  )
}

export default memo(BookingForm)
