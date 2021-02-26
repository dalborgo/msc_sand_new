import React from 'react'
import { withStyles } from '@material-ui/core'
import { TableHeaderRow, Toolbar, Table, PagingPanel } from '@devexpress/dx-react-grid-material-ui'

const styleCell = theme => ({
  cell: {
    padding: theme.spacing(0, 2, 1),
  },
})
const stylePaging = theme => ({
  pager: {
    padding: theme.spacing(0),
  },
})
const styleToolbar = theme => ({
  toolbar: {
    padding: theme.spacing(0, 2),
    minHeight: theme.spacing(6),
    borderBottom: 0,
    [theme.breakpoints.down('sm')]: {// mobile
      display: 'none',
    },
  },
})
export {default as LoadingComponent} from './LoadingComponent'
export {default as SearchInput} from './SearchInput'
export {default as SearchPanelIntl} from './SearchPanelIntl'
export const SummaryCellBase = props => {
  return <Table.Cell {...props}/>
}
export const PagingComponentBase = props => {
  return <PagingPanel.Container {...props}/>
}

export const CellSummary = withStyles(styleCell, { withTheme: true })(
  SummaryCellBase
)

const tableHeader =  ({ theme, children, ...rest }) => (
  <TableHeaderRow.Cell
    {...rest}
    children={children}
    style={{ paddingLeft: theme.spacing(2) }} //la prima cella prendeva un valore più forte
  />
)

//c'era un warning sul campo children mancante
export const CellHeader = withStyles(styleCell, { withTheme: true })(tableHeader)
export const PagingComponent = withStyles(stylePaging, { withTheme: true })(PagingComponentBase)

export const RootToolbar = withStyles(styleToolbar)(
  (props) => (
    <Toolbar.Root
      {...props}
    />
  )
)
