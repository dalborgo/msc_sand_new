import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Page from 'src/components/Page'
import { Box, Button, makeStyles } from '@material-ui/core'
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
import { useCertificateStore, useGeneralStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import RightDrawer from 'src/components/RightDrawer'
import { getEffectiveFetching } from 'src/utils/logics'
import FilterForm from './FilterForm'
import { cDate } from '@adapter/common'
import StatsList from './StatsList'
import { exportQuery } from 'src/utils/axios'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { exportContainers, getConfirmExportText } from './utils'
import parse from 'html-react-parser'

const useStyles = makeStyles(theme => ({
  block: {
    margin: theme.spacing(1, 3),
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
const loadingSel = state => ({ setLoading: state.setLoading, loading: state.loading })
const CertificateList = () => {
  const classes = useStyles()
  const snackQueryError = useSnackQueryError()
  const { enqueueSnackbar } = useSnackbar()
  const [isRefetch, setIsRefetch] = useState(false)
  const { setLoading, loading } = useGeneralStore(loadingSel, shallow)
  const confirm = useConfirm()
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
  const handleExport = useCallback(async event => {
    try {
      const filter = { typeOfGoods, bookingDateFrom, bookingDateTo }
      const hasFilter = Boolean(typeOfGoods || bookingDateFrom || bookingDateTo)
      if (hasFilter) {await confirm({ description: parse(getConfirmExportText(filter, intl)) })}
      setLoading(true)
      const { results } = await exportQuery('certificates/export', filter)
      const isBooking = event.target?.parentElement?.id === 'exportBooking'
      exportContainers(results, filter, intl, isBooking)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      const { message } = err || {}
      message && enqueueSnackbar(messages[message] ? intl.formatMessage(messages[message]) : message)
    }
  }, [bookingDateFrom, bookingDateTo, confirm, enqueueSnackbar, intl, setLoading, typeOfGoods])
  const isFilterActive = useMemo(() => Boolean(typeOfGoods || bookingDateFrom || bookingDateTo), [bookingDateFrom, bookingDateTo, typeOfGoods])
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
                <Button
                  disabled={loading}
                  id="exportContainers"
                  onClick={handleExport}
                  size="small"
                  variant="outlined"
                >
                  Export containers
                </Button>
              </Box>
              &nbsp;&nbsp;
              <Box>
                <Button
                  disabled={loading}
                  id="exportBooking"
                  onClick={handleExport}
                  size="small"
                  variant="outlined"
                >
                  Export booking
                </Button>
              </Box>
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
      <div className={classes.block}>
        <StatsList stats={data?.results?.stats}/>
      </div>
      <Paper className={classes.block}>
        <TableList
          isFetching={effectiveFetching && !data?.results?.list?.length}
          isIdle={rest.isIdle}
          rows={data?.results?.list || []}
        />
      </Paper>
    </Page>
  )
}

export default CertificateList
