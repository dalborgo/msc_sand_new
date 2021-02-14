import { withStyles } from '@material-ui/core'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { THEMES } from 'src/constants'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

export const Accordion = withStyles({
  root: {
    border: 0,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

export const AccordionDetails = withStyles(() => ({
  root: {
    display: 'block',
  },
}))(MuiAccordionDetails)

export const AccordionSummary = withStyles(theme => ({
  root: {
    color: theme.palette.text.secondary,
    backgroundColor: 'none',
    ...theme.name === THEMES.LIGHT ?
      {
        borderBottom: '1px solid #c4c4c4',
      }
      : {},
    ...theme.name === THEMES.ONE_DARK ?
      {
        borderBottom: '1px solid #5a5d63',
      }
      : {},
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 1),
    minHeight: 0,
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    '&$expanded': {
      margin: '0px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary)
