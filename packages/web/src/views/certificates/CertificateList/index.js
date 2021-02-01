import React, { memo, useCallback, useMemo } from 'react'
import Page from 'src/components/Page'
import { Box, makeStyles, TextField as TF, Button } from '@material-ui/core'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import StandardHeader from 'src/components/StandardHeader'
import { useQuery } from 'react-query'
import Paper from '@material-ui/core/Paper'
import { useSnackQueryError } from 'src/utils/reactQueryFunctions'
import { getEffectiveFetching } from 'src/utils/logics'
import { StandardBreadcrumb } from 'src/components/StandardBreadcrumb'
import IconButtonLoader from 'src/components/IconButtonLoader'
import TableList from './TableList'
import { FastField, Form, Formik } from 'formik'
import FilterButton from 'src/components/FilterButton'
import { validation } from '@adapter/common'
import { useCertificateStore, useNewBookingStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import RightDrawer from 'src/components/RightDrawer'

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(0, 3),
  },
  container: {
    padding: 0,
    [theme.breakpoints.down('sm')]: { //mobile
      padding: theme.spacing(0, 2),
    },
  },
}))
const { typesOfGoods } = useNewBookingStore.getState()
const FilterForm = memo(function FilterForm ({ typeOfGoods, onSubmit }) {
  console.log('%cRENDER_FORM', 'color: pink')
  const intl = useIntl()
  return (
    <Formik
      initialValues={{ typeOfGoods: typeOfGoods }}
      onSubmit={onSubmit}
    >
      {
        ({ handleChange, dirty, setValues, values }) => (
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
            <Box display="flex" justifyContent="flex-end">
              <Box mr={2}>
                <Button onClick={() => setValues(validation.resetAll(values))} size="small" variant="contained">
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
const certificateSelector = state => ({
  openFilter: state.openFilter,
  submitFilter: state.submitFilter,
  switchOpenFilter: state.switchOpenFilter,
  typeOfGoods: state.filter.typeOfGoods,
})

const CertificateList = () => {
  const classes = useStyles()
  const snackQueryError = useSnackQueryError()
  const intl = useIntl()
  const {
    openFilter,
    switchOpenFilter,
    submitFilter,
    typeOfGoods,
  } = useCertificateStore(certificateSelector, shallow)
  const { data, isIdle, refetch, ...rest } = useQuery(
    ['certificates/list',
      {
        typeOfGoods,
      },
    ],
    {
      keepPreviousData: true,
      refetchOnMount: false,
      onError: snackQueryError,
    })
  const effectiveFetching = getEffectiveFetching(rest)
  const onFilterSubmit = useCallback(filter => {
    submitFilter(filter)
    return filter
  }, [submitFilter])
  const FilterFormWr = useMemo(() => (
    <FilterForm onSubmit={onFilterSubmit} typeOfGoods={typeOfGoods}/>
  ), [onFilterSubmit, typeOfGoods])
  return (
    <Page
      title={intl.formatMessage(messages['menu_certificate_list'])}
    >
      <div className={classes.container}>
        <StandardHeader
          breadcrumb={
            <StandardBreadcrumb
              crumbs={
                [
                  { name: intl.formatMessage(messages['sub_bookings']) },
                  {
                    to: '/app/booking/new-booking',
                    name: intl.formatMessage(messages['menu_new_booking']),
                  },
                ]
              }
            />
          }
          rightComponent={
            <Box alignItems="center" display="flex">
              <Box>
                <IconButtonLoader
                  isFetching={effectiveFetching}
                  onClick={refetch}
                />
              </Box>
              <Box>
                <FilterButton
                  isActive={typeOfGoods}
                  onClick={switchOpenFilter}
                />
              </Box>
            </Box>
          }
        >
          <FormattedMessage defaultMessage="Retrieve Certificate" id="certificates.list.header_title"/>
        </StandardHeader>
        <RightDrawer open={openFilter} switchOpen={switchOpenFilter}>
          {FilterFormWr}
        </RightDrawer>
      </div>
      <Box alignItems="center" display="flex" p={2} pt={0}/>
      <Paper className={classes.paper}>
        <TableList isFetching={effectiveFetching && !data?.results?.length} isIdle={isIdle} rows={data?.results || []}/>
      </Paper>
    </Page>
  )
}

export default CertificateList
