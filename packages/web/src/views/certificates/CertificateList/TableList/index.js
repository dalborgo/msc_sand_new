import React, { memo, useCallback, useState } from 'react'
import { Grid, Table, TableHeaderRow, Toolbar, PagingPanel } from '@devexpress/dx-react-grid-material-ui'
import { IntegratedFiltering, IntegratedPaging, PagingState, SearchState } from '@devexpress/dx-react-grid'
import { Cell } from './comps'
import { LoadingComponent } from 'src/components/tableComponents'
import { CellHeader, PagingComponent, RootToolbar } from 'src/components/tableComponents'
import { SearchPanelIntl } from 'src/components/tableComponents'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'

const getRowId = row => row.code

const tableColumnExtensions = [
  { columnName: 'actions', align: 'right' },
]

const IntegratedFilteringSel = memo(function IntegratedFilteringSel () {
  const filteringColumnExtensions = ['covers', 'date']
    .map(columnName => ({
      columnName,
      predicate: () => false,
    }))
  return (
    <IntegratedFiltering
      columnExtensions={filteringColumnExtensions}
    />
  )
})

const getPortName = (data, column) => data[column] ? `${data[column]?.value} (${data[column]?.key})` : ''
const pageSizes = [12, 25, 50]
const TableList = memo(function TableList ({ rows, isFetching, isIdle }) {
  console.log('%c***EXPENSIVE_RENDER_TABLE', 'color: yellow')
  const intl = useIntl()
  const [columns] = useState([
    { name: 'code', title: intl.formatMessage(messages['certificates_column_certificate_number']) },
    { name: '_createdAt', title: intl.formatMessage(messages['certificates_column_policy_creation_date']) },
    { name: 'policyNumber', title: intl.formatMessage(messages['certificates_column_policy_number']) },
    { name: 'bookingRef', title: intl.formatMessage(messages['certificates_column_booking_ref']) },
    {
      name: 'portLoading',
      title: intl.formatMessage(messages['certificates_column_port_loading']),
      getCellValue: getPortName,
    },
    {
      name: 'portDischarge',
      title: intl.formatMessage(messages['certificates_column_port_discharge']),
      getCellValue: getPortName,
    },
    { name: 'actions', title: intl.formatMessage(messages['certificates_column_actions']) },
  ])
  const [pagingMessages] = useState({
    info: intl.formatMessage(messages['certificates_table_info']),
    showAll: intl.formatMessage(messages['certificates_table_show_all']),
    rowsPerPage: intl.formatMessage(messages['certificates_table_rows_per_page']),
  })
  const noDataCellComponent = useCallback(({ colSpan }) =>
    <LoadingComponent colSpan={colSpan} idle={isIdle} isFetching={isFetching}/>, [isFetching, isIdle])
  return (
    <Grid
      columns={columns}
      getRowId={getRowId}
      rows={rows}
    >
      <SearchState/>
      <IntegratedFilteringSel/>
      <PagingState
        defaultCurrentPage={0}
        defaultPageSize={12}
      />
      <IntegratedPaging />
      <Table
        cellComponent={Cell}
        columnExtensions={tableColumnExtensions}
        noDataCellComponent={noDataCellComponent}
      />
      <Toolbar
        rootComponent={RootToolbar}
      />
      <TableHeaderRow cellComponent={CellHeader}/>
      <PagingPanel
        containerComponent={PagingComponent}
        messages={pagingMessages}
        pageSizes={pageSizes}
      />
      <SearchPanelIntl/>
    </Grid>
  )
})

export default TableList
