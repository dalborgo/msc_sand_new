import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Page from 'src/components/Page'
import { Box, makeStyles } from '@material-ui/core'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import StandardHeader from 'src/components/StandardHeader'
import { useQuery } from 'react-query'
import Paper from '@material-ui/core/Paper'
import { useSnackQueryError } from 'src/utils/reactQueryFunctions'
import { StandardBreadcrumb } from 'src/components/StandardBreadcrumb'
import IconButtonLoader from 'src/components/IconButtonLoader'
import TableList from './TableList'
import FilterButton from 'src/components/FilterButton'
import { useCertificateStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import RightDrawer from 'src/components/RightDrawer'
import { getEffectiveFetching } from 'src/utils/logics'
import FilterForm from './FilterForm'
import { cDate } from '@adapter/common'

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

const certificateSelector = state => ({
  openFilter: state.openFilter,
  submitFilter: state.submitFilter,
  switchOpenFilter: state.switchOpenFilter,
  typeOfGoods: state.filter.typeOfGoods,
  bookingDateFrom: state.filter.bookingDateFrom,
  bookingDateTo: state.filter.bookingDateTo,
  getQueryKey: state.getQueryKey,
  reset: state.reset,
})

const CertificateList = () => {
  const classes = useStyles()
  const snackQueryError = useSnackQueryError()
  const [isRefetch, setIsRefetch] = useState(false)
  const intl = useIntl()
  const {
    getQueryKey,
    bookingDateFrom,
    bookingDateTo,
    openFilter,
    reset,
    submitFilter,
    switchOpenFilter,
    typeOfGoods,
  } = useCertificateStore(certificateSelector, shallow)
  const isFilterActive = useMemo(()=> Boolean(typeOfGoods || bookingDateFrom || bookingDateTo), [bookingDateFrom, bookingDateTo, typeOfGoods])
  const { data, refetch, ...rest } = useQuery(getQueryKey(),
    {
      keepPreviousData: true,
      notifyOnChangeProps: ['data', 'error'],
      onError: snackQueryError,
      refetchOnMount: false,
    }
  )
  const refetchOnClick = useCallback(async () => {
    setIsRefetch(true)
    await refetch()
    setIsRefetch(false)
  }, [refetch])
  
  const effectiveFetching = getEffectiveFetching(rest, isRefetch)
  useEffect(() => reset, [reset]) //occhio reset senza parentesi: si passa la funzione non si esegue
  const onFilterSubmit = useCallback(filter => {
    const normalizeFilter = {
      ...filter,
      bookingDateFrom: filter.bookingDateFrom && cDate.mom(filter.bookingDateFrom, null, 'YYYY-MM-DD'),
      bookingDateTo: filter.bookingDateTo && cDate.mom(filter.bookingDateTo, null, 'YYYY-MM-DD'),
    }
    submitFilter(normalizeFilter)
    return filter
  }, [submitFilter])
  const FilterFormWr = useMemo(() => (
    <FilterForm 
      bookingDateFrom={bookingDateFrom}
      bookingDateTo={bookingDateTo}
      onSubmit={onFilterSubmit}
      typeOfGoods={typeOfGoods}
    />
  ), [bookingDateFrom, bookingDateTo, onFilterSubmit, typeOfGoods])
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
                  onClick={refetchOnClick}
                />
              </Box>
              <Box ml={0.5}>
                <FilterButton
                  isActive={isFilterActive}
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
        <TableList
          isFetching={effectiveFetching && !data?.results?.length}
          isIdle={rest.isIdle}
          rows={data?.results || []}
        />
      </Paper>
    </Page>
  )
}

export default CertificateList
