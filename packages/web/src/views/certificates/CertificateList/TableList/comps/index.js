import { Button, Link, SvgIcon, withStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import Box from '@material-ui/core/Box'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { useMoneyFormatter } from 'src/utils/formatters'
import { useGeneralStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import { ExternalLink as ExternalLinkIcon } from 'react-feather'
import { manageFile } from 'src/utils/axios'
import { useSnackbar } from 'notistack'
import useAuth from 'src/hooks/useAuth'

export const summaryCalculator = (type, rows, getValue) => {
  if (type === 'incomeSum') {
    return rows.reduce((prev, curr) => {
      prev.tot += curr.pu_totale_totale || 0
      prev.sc += curr.pu_totale_sc || 0
      prev.st += curr.pu_totale_st || 0
      return prev
    }, { tot: 0, sc: 0, st: 0 })
  } else {
    return IntegratedSummary.defaultCalculator(type, rows, getValue)
  }
}
export const SummaryCellBase = props => {
  const { column, children } = props
  const moneyFormatter = useMoneyFormatter()
  if (column.name === 'income') {
    const { columnSummaries } = children.props || {}
    const [first] = columnSummaries
    return (
      <Table.Cell {...props}>
        <Box color="text.primary" fontWeight="bold">
          <FormattedMessage
            defaultMessage="Totale"
            id="reports.total"
          />: {moneyFormatter(first.value.tot)}
        </Box>
        {
          first.value.sc > 0 &&
          <Box color="red">
            <FormattedMessage
              defaultMessage="Totale Sconti"
              id="reports.tot_discount"
            />: {moneyFormatter(first.value.sc)}
          </Box>
        }
        {
          first.value.st > 0 &&
          <Box color="orange">
            <FormattedMessage
              defaultMessage="Totale Storni"
              id="reports.closing_day.tot_reversal "
            />: {moneyFormatter(first.value.st)}
          </Box>
        }
      </Table.Cell>
    )
  } else {
    return <Table.Cell {...props}/>
  }
}
const loadingSel = state => ({ setLoading: state.setLoading, loading: state.loading })
const { bucket, couchbaseUrl } = useGeneralStore.getState()
const CellBase = props => {
  const { column, row, theme, value } = props
  const { user: { priority } } = useAuth()
  const { setLoading } = useGeneralStore(loadingSel, shallow)
  const [intLoading, setIntLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const cellStyle = { paddingLeft: theme.spacing(2) }
  if (column.name === 'code') {
    return (
      <Table.Cell {...props} style={{ paddingLeft: theme.spacing(2) }}>
        {
          priority === 4 ?
            <Link
              color="inherit"
              href={`http://${couchbaseUrl}:8091/ui/index.html#!/buckets/documents/CERTIFICATE%7C${value}?bucket=${bucket}`}
              target="_blank"
            >
              {value}
            </Link>
            :
            value
        }
      </Table.Cell>
    )
  }
  if (column.name === 'actions') {
    return (
      <Table.Cell {...props}>
        <Button
          disabled={intLoading}
          onClick={
            async () => {
              setLoading(true)
              setIntLoading(true)
              const { ok, message } = await manageFile(
                `certificates/print/${row.code}`,
                `${row.code}.pdf`,
                'application/pdf',
                { toSave: false },
                { toDownload: false }
              )
              setIntLoading(false)
              setLoading(false)
              !ok && enqueueSnackbar(message)
            }
          }
          size="small"
          startIcon={<SvgIcon fontSize="small"><ExternalLinkIcon/></SvgIcon>}
          style={{ textTransform: 'none' }}
          variant="contained"
        >
          PDF
        </Button>
      </Table.Cell>
    )
  }
  return <Table.Cell {...props} style={cellStyle}/>
}

const styles = theme => ({
  cell: {
    padding: theme.spacing(1, 2),
  },
})

export const Cell = withStyles(styles, { withTheme: true })(
  CellBase
)
export const CellSummary = withStyles(styles, { withTheme: true })(
  SummaryCellBase
)
