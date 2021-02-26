import React, { memo, useCallback, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useCertificateStore, useGeneralStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { useSnackbar } from 'notistack'
import { makeStyles, TextField, Typography } from '@material-ui/core'
import { manageFile } from 'src/utils/axios'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  dialogActions: {
    padding: theme.spacing(0.8, 2),
  },
  dialogTitle: {
    padding: theme.spacing(1.3, 2),
  },
  dialogContent: {
    padding: theme.spacing(3, 2, 3),
  },
  divContainer: {
    minWidth: 500,
    '& .MuiInputLabel-root': {
      marginTop: 2,
      fontSize: '0.9rem',
    },
    '& .MuiFormControl-root ': {
      backgroundColor: theme.palette.background.dark,
      marginRight: theme.spacing(2),
    },
  },
}))
const certificateSelector = state => ({
  open: state.openSoaDialog,
  filter: state.filter,
  handleClose: state.handleCloseSoaDialog,
})

function years () {
  const output = []
  const currentPlus = moment().add(1, 'year').format('YYYY')
  for (let i = currentPlus; i > currentPlus - 5; i--) {
    output.push(i)
  }
  return output
}

const YEARS = years()
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

const loadingSel = state => ({ setLoading: state.setLoading, loading: state.loading })
const SoaDialog = () => {
  console.log('%cRENDER_SOA', 'color: yellow')
  const { setLoading } = useGeneralStore(loadingSel, shallow)
  const { open, handleClose } = useCertificateStore(certificateSelector, shallow)
  const classes = useStyles()
  const intl = useIntl()
  const { enqueueSnackbar } = useSnackbar()
  
  const [state, setState] = useState({
    year: moment().format('YYYY'),
    month: moment().format('MM'),
  })
  
  const handleChange = useCallback(event => {
    event.persist()
    const name = event.target.name
    setState({
      ...state,
      [name]: event.target.value,
    })
  }, [state])
  const generate = useCallback(async () => {
    try {
      const { month, year } = state
      const code = `${year}_${month}`
      const bookingDateFrom = `${year}-${month}-01`
      const filter = {
        bookingDateFrom,
        bookingDateEnd: `${year}-${month}-${moment(bookingDateFrom).daysInMonth()}`,
      }
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
  }, [enqueueSnackbar, intl, setLoading, state])
  
  return (
    <Dialog
      aria-describedby="scroll-select-dialog-description"
      aria-labelledby="scroll-select-dialog-title"
      maxWidth="lg"
      onClose={handleClose}
      open={Boolean(open)}
      scroll="paper"
    >
      <div className={classes.divContainer}>
        <DialogTitle className={classes.dialogTitle} disableTypography id="scroll-select-dialog-title">
          <Typography variant="h5">
            <FormattedMessage defaultMessage="Generate SOA report" id="certificates.generate_report"/>
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent} dividers>
          <TextField
            className={classes.formControl}
            label={intl.formatMessage(messages['common_year'])}
            name="year"
            onChange={handleChange}
            onFocus={() => null}
            select
            SelectProps={
              {
                native: true,
              }
            }
            style={
              {
                minWidth: 150,
              }
            }
            value={state.year}
            variant="outlined"
          >
            {
              YEARS.map(val => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))
            }
          </TextField>
          <TextField
            className={classes.formControl}
            label={intl.formatMessage(messages['common_month'])}
            name="month"
            onChange={handleChange}
            onFocus={() => null}
            select
            SelectProps={
              {
                native: true,
              }
            }
            style={
              {
                minWidth: 100,
              }
            }
            value={state.month}
            variant="outlined"
          >
            {
              MONTHS.map(val => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))
            }
          </TextField>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button color="default" onClick={handleClose} size="small">
            {intl.formatMessage(messages['common_cancel'])}
          </Button>
          <Button color="secondary" onClick={generate} size="small">
            {intl.formatMessage(messages['common_generate'])}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default memo(SoaDialog)
