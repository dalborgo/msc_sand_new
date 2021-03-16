import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Page from 'src/components/Page'
import { Box, Button, makeStyles, SvgIcon } from '@material-ui/core'
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
import useAuth from 'src/hooks/useAuth'
import ExportMenu from './ExportMenu'
import isEmpty from 'lodash/isEmpty'
import pickBy from 'lodash/pickBy'
import SoaDialog from './SoaDialog'
import { FileText as FileTextIcon } from 'react-feather'

const useStyles = makeStyles(theme => ({
  block: {
    margin: theme.spacing(1, 3),
  },
  container: {
    padding: 0,
    [theme.breakpoints.down('sm')]: {// mobile
      padding: theme.spacing(0, 2),
    },
  },
}))

const calculateFilterActive = filters => !isEmpty(pickBy(filters, elem => Boolean(elem) === true))

const certificateSelector = state => ({
  getQueryKey: state.getQueryKey,
  openFilter: state.openFilter,
  setOpenSoaDialog: state.setOpenSoaDialog,
  submitFilter: state.submitFilter,
  switchOpenFilter: state.switchOpenFilter,
  reset: state.reset,
  ...state.filter,
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
    getQueryKey,
    openFilter,
    reset,
    setOpenSoaDialog,
    submitFilter,
    switchOpenFilter,
    ...filters
  } = useCertificateStore(certificateSelector, shallow)
  const isFilterActive = useMemo(() => calculateFilterActive(filters), [filters])
  const handleExport = useCallback(async event => {
    try {
      const filter = {
        ...filters,
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
  }, [confirm, enqueueSnackbar, intl, isFilterActive, priority, filters, setLoading])
  
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
      creationDateFrom: filter.creationDateFrom && cDate.mom(filter.creationDateFrom, null, 'YYYY-MM-DD'),
      creationDateTo: filter.creationDateTo && cDate.mom(filter.creationDateTo, null, 'YYYY-MM-DD'),
    }
    submitFilter(normalizeFilter)
    return filter
  }, [submitFilter])
  const FilterFormWr = useMemo(() => (
    <FilterForm
      onSubmit={onFilterSubmit}
      {...filters}
    />
    // eslint-disable-next-line
  ), [onFilterSubmit, filters.creationDateFrom, filters.creationDateTo, filters.typeGoodsValue, filters.typeRate, filters.bookingDateFrom, filters.bookingDateTo, filters.bookingRef, filters.countryPortDischarge, filters.countryPortLoading, filters.maxGoodsValue, filters.minGoodsValue, filters.portDischarge, filters.portLoading, filters.typeOfGoods])
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
                <Button
                  onClick={() => setOpenSoaDialog(true)}
                  size="small"
                  variant="contained"
                >
                  <SvgIcon fontSize="small">
                    <FileTextIcon/>
                  </SvgIcon>
                  &nbsp;&nbsp;SOA
                </Button>
              </Box>
              <Box ml={1}>
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
      <SoaDialog/>
    </Page>
  )
}

export default CertificateList
