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
import { cDate, numeric } from '@adapter/common'
import StatsList from './StatsList'
import { exportQuery, manageFile } from 'src/utils/axios'
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { exportContainers, getConfirmExportText } from './utils'
import parse from 'html-react-parser'
import useAuth from 'src/hooks/useAuth'
import ExportMenu from './ExportMenu'

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
  bookingDateFrom: state.filter.bookingDateFrom,
  bookingDateTo: state.filter.bookingDateTo,
  bookingRef: state.filter.bookingRef,
  countryPortDischarge: state.filter.countryPortDischarge,
  countryPortLoading: state.filter.countryPortLoading,
  getQueryKey: state.getQueryKey,
  maxGoodsValue: state.filter.maxGoodsValue,
  minGoodsValue: state.filter.minGoodsValue,
  openFilter: state.openFilter,
  portDischarge: state.filter.portDischarge,
  portLoading: state.filter.portLoading,
  submitFilter: state.submitFilter,
  switchOpenFilter: state.switchOpenFilter,
  typeOfGoods: state.filter.typeOfGoods,
  reset: state.reset,
})
const loadingSel = state => ({ setLoading: state.setLoading, loading: state.loading })

const CertificateList = () => {
  const classes = useStyles()
  const { user: { priority } } = useAuth()
  const snackQueryError = useSnackQueryError()
  const { enqueueSnackbar } = useSnackbar()
  const [isRefetch, setIsRefetch] = useState(false)
  const { setLoading } = useGeneralStore(loadingSel, shallow)
  const [anchorElExportMenu, setAnchorElExportMenu] = React.useState(null)
  
  const handleCloseExportMenu = () => {
    setAnchorElExportMenu(null)
  }
  const confirm = useConfirm()
  const intl = useIntl()
  const {
    bookingDateFrom,
    bookingDateTo,
    bookingRef,
    countryPortDischarge,
    countryPortLoading,
    getQueryKey,
    maxGoodsValue,
    minGoodsValue,
    openFilter,
    portDischarge,
    portLoading,
    reset,
    submitFilter,
    switchOpenFilter,
    typeOfGoods,
  } = useCertificateStore(certificateSelector, shallow)
  const isFilterActive = useMemo(() => Boolean(maxGoodsValue || minGoodsValue || countryPortDischarge || portDischarge || bookingRef || portLoading || countryPortLoading || typeOfGoods || bookingDateFrom || bookingDateTo), [bookingDateFrom, bookingDateTo, bookingRef, countryPortDischarge, countryPortLoading, maxGoodsValue, minGoodsValue, portDischarge, portLoading, typeOfGoods])
  const handleExport = useCallback(async event => {
    try {
      const filter = {
        countryPortDischarge,
        portDischarge,
        bookingRef,
        portLoading,
        maxGoodsValue,
        minGoodsValue,
        countryPortLoading,
        typeOfGoods,
        bookingDateFrom,
        bookingDateTo,
      }
      if (isFilterActive) {
        await confirm({
          description: parse(getConfirmExportText(filter, intl)),
        })
      }
      setLoading(true)
      const { results } = await exportQuery('certificates/export', filter)
      const isBooking = event.target?.id === 'exportBooking'
      exportContainers(results, filter, intl, isBooking, priority)
      handleCloseExportMenu()
      setLoading(false)
    } catch (err) {
      setLoading(false)
      const { message } = err || {}
      message && enqueueSnackbar(messages[message] ? intl.formatMessage(messages[message]) : message)
    }
  }, [countryPortDischarge, portDischarge, bookingRef, portLoading, maxGoodsValue, minGoodsValue, countryPortLoading, typeOfGoods, bookingDateFrom, bookingDateTo, isFilterActive, setLoading, intl, priority, confirm, enqueueSnackbar])
  const handleExport2 = useCallback(async () => {
    try {
      const filter = {
        countryPortDischarge,
        portDischarge,
        bookingRef,
        portLoading,
        maxGoodsValue,
        minGoodsValue,
        countryPortLoading,
        typeOfGoods,
        bookingDateFrom,
        bookingDateTo,
      }
      if (isFilterActive) {
        await confirm({
          description: parse(getConfirmExportText(filter, intl)),
        })
      }
      const code = 'prova'
      setLoading(true)
      const { ok, message } = await manageFile(
        `soa/print/${code}`,
        `${code}.pdf`,
        'application/pdf',
        { toSave: false, filter },
        { toDownload: false }
      )
      setLoading(false)
      !ok && enqueueSnackbar(message)
    } catch (err) {
      setLoading(false)
      const { message } = err || {}
      message && enqueueSnackbar(messages[message] ? intl.formatMessage(messages[message]) : message)
    }
  }, [countryPortDischarge, portDischarge, bookingRef, portLoading, maxGoodsValue, minGoodsValue, countryPortLoading, typeOfGoods, bookingDateFrom, bookingDateTo, isFilterActive, setLoading, enqueueSnackbar, confirm, intl])
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
  useEffect(() => reset, [reset])// reset senza parentesi: si passa la funzione non si esegue
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
      bookingRef={bookingRef}
      countryPortDischarge={countryPortDischarge}
      countryPortLoading={countryPortLoading}
      maxGoodsValue={maxGoodsValue}
      minGoodsValue={minGoodsValue}
      onSubmit={onFilterSubmit}
      portDischarge={portDischarge}
      portLoading={portLoading}
      typeOfGoods={typeOfGoods}
    />
  ), [bookingDateFrom, bookingDateTo, bookingRef, countryPortDischarge, countryPortLoading, maxGoodsValue, minGoodsValue, onFilterSubmit, portDischarge, portLoading, typeOfGoods])
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
                  onClick={handleExport2}
                >
                  SOA
                </Button>
              </Box>
              <Box>
                <IconButtonLoader
                  isFetching={effectiveFetching}
                  onClick={refetchOnClick}
                />
              </Box>
              <Box ml={0.5}>
                <ExportMenu
                  anchorEl={anchorElExportMenu}
                  handleExport={handleExport}
                  onClose={handleCloseExportMenu}
                  setAnchorEl={setAnchorElExportMenu}
                />
              </Box>
              <Box ml={1}>
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
