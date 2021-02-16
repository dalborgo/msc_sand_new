import React, { useEffect, useRef } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import Page from 'src/components/Page'
import DivContentWrapper from 'src/components/DivContentWrapper'
import { StandardBreadcrumb } from 'src/components/StandardBreadcrumb'
import { FormattedMessage, useIntl } from 'react-intl'
import StandardHeader from 'src/components/StandardHeader'
import { messages } from 'src/translations/messages'
import { Form, Formik } from 'formik'
import BookingForm from './BookingForm'
import { checkValues } from './validate'
import { axiosLocalInstance, useSnackQueryError } from 'src/utils/reactQueryFunctions'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useGeneralStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import { useSnackbar } from 'notistack'
import useNewBookingStore from 'src/zustandStore/useNewBookingStore'
import ConfirmDialog from './ConfirmDialog'

const useStyles = makeStyles(theme => ({
  page: {
    maxWidth: theme.breakpoints.values['md'],
  },
  paper: {
    height: '100%',
    overflow: 'none',
    maxWidth: theme.breakpoints.values['md'] - theme.spacing(3),
  },
}))

const saveCertificateMutation = async values => {
  const { data } = await axiosLocalInstance.post('certificates/save', {
    ...values,
  })
  return data
}

const newBookingSelector = state => ({
  reset: state.reset,
  setBookingStore: state.set,
})

const loadingSel = state => ({ setLoading: state.setLoading })
const NewBooking = () => {
  const snackQueryError = useSnackQueryError()
  useQuery('jwt/check_session', { onError: snackQueryError })
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const {
    reset,
    setBookingStore,
  } = useNewBookingStore(newBookingSelector, shallow)
  const queryClient = useQueryClient()
  const intl = useIntl()
  const submitRef = useRef()
  const bookingFromRef = useRef()
  const { setLoading } = useGeneralStore(loadingSel, shallow)
  const { mutateAsync: saveCertificate } = useMutation(saveCertificateMutation, {
    onMutate: () => {
      setLoading(true)
    },
    onSettled: async (data, error) => {
      const { ok, message, err } = data || {}
      if (!ok || error) {
        snackQueryError(err || message || error)
      } else {
        const queryListKey = 'certificates/list'
        const oldCertificateList = queryClient.getQueryData(queryListKey)
        if (oldCertificateList) {
          const newCertificateList = {
            ok: oldCertificateList.ok,
            results: {
              stats: {
                total: oldCertificateList?.results?.list.length + 1,
                totalContainers: (oldCertificateList?.results?.stats?.totalContainers + data.results?.containers) || 0,
                totalImportantCustomers: oldCertificateList?.results?.stats?.totalImportantCustomers + data.results?.importantCustomers,
              },
              list: [
                data.results?.certificate,
                ...oldCertificateList?.results?.list,
              ],
            },
          }
          queryClient.removeQueries(queryListKey)
          queryClient.setQueryData(queryListKey, newCertificateList)
        } else {
          await queryClient.prefetchQuery(queryListKey)
        }
        enqueueSnackbar(intl.formatMessage(messages['booking_save_certificate_ok'], { code: data.results?.code }), { variant: 'success' })
      }
      setLoading(false)
    },
  })
  useEffect(() => reset, [reset])
  return (
    <Page
      title={intl.formatMessage(messages['menu_new_booking'])}
    >
      <Formik
        initialValues={
          {
            acceptedByMSC: false,
            bookingDate: null,
            bookingRef: '',
            cityCollectionPoint: '',
            cityDeliveryPoint: '',
            countryCollectionPoint: null,
            countryDeliveryPoint: null,
            countryPortDischarge: null,
            countryPortLoading: null,
            currencyGoods: 'EUR',
            departureDate: null,
            goodsQuantity: '',
            goodsValue: '',
            goodsWeight: '',
            importantCustomer: false,
            insuranceType: '',
            moreGoodsDetails: '',
            numberContainers: '',
            policyHolders: '',
            portDischarge: null,
            portLoading: null,
            rate: '0,175', // rate vip, normal container
            recipients: ['To the orders as per Bill of Lading'],
            reeferContainer: false,
            sender: 'MSC for whom it may concern',
            specialConditions: '',
            typeOfGoods: '',
            vesselMail: '',
            vesselName: '',
            vesselPhone: '',
          }
        }
        innerRef={bookingFromRef}
        onSubmit={
          async values => {
            try {
              const confirmedValues = checkValues(values)
              setBookingStore(state => {
                state.openConfirmDialog = true
                state.confirmedValues = confirmedValues
              })
              return true
            } catch (err) {
              const { message } = err || {}
              message && enqueueSnackbar(messages[message] ? intl.formatMessage(messages[message]) : message)
            }
          }
        }
      >
        <>
          <div className={classes.page}>
            <StandardHeader
              breadcrumb={
                <StandardBreadcrumb
                  crumbs={
                    [{ name: intl.formatMessage(messages['sub_certificates']) }, {
                      to: '/app/certificates/list',
                      name: intl.formatMessage(messages['menu_retrieve_certificate']),
                    }]
                  }
                />
              }
              rightComponent={
                <Button onClick={() => submitRef.current.click()} size="small" variant="contained">
                  <FormattedMessage
                    defaultMessage="Review and Save"
                    id="booking.button_review_and_save"
                  />
                </Button>
              }
            >
              <FormattedMessage defaultMessage="Create a New Booking" id="booking.new_booking.header_title"/>
            </StandardHeader>
          </div>
          <DivContentWrapper
            contentProps={
              {
                overflowY: 'auto',
              }
            }
          >
            <Form style={{ height: '100%' }}>
              <div className={classes.paper}>
                <BookingForm bookingFromRef={bookingFromRef}/>
                <Button ref={submitRef} style={{ display: 'none' }} type="submit"/>
              </div>
            </Form>
            <ConfirmDialog bookingFromRef={bookingFromRef} saveCertificate={saveCertificate}/>
          </DivContentWrapper>
        </>
      </Formik>
    </Page>
  )
}
export default NewBooking
