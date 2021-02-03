import React, { useCallback } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useNewBookingStore } from 'src/zustandStore'
import shallow from 'zustand/shallow'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { useSnackbar } from 'notistack'
import { makeStyles, Typography } from '@material-ui/core'
import useAuth from 'src/hooks/useAuth'
import DataLayout from './DataLayout'

const useStyles = makeStyles(theme => ({
  dialogActions: {
    padding: theme.spacing(0.8, 2),
  },
  dialogTitle: {
    padding: theme.spacing(1.3, 2),
  },
  dialogContent: {
    paddingBottom: theme.spacing(0.5),
  },
}))
const newBookingSelector = state => ({
  open: state.openConfirmDialog,
  handleClose: state.handleCloseConfirmDialog,
  values: state.confirmedValues,
})
export default function ConfirmDialog ({ saveCertificate, bookingFromRef }) {
  const {
    open,
    handleClose,
    values,
  } = useNewBookingStore(newBookingSelector, shallow)
  const { user } = useAuth()
  const classes = useStyles()
  const intl = useIntl()
  const { enqueueSnackbar } = useSnackbar()
  const save = useCallback(async () => {
    try {
      const { ok } = await saveCertificate({ ...values, _createdBy: user.display })
      if (ok) {
        handleClose()
        bookingFromRef.current.resetForm()
      }
    } catch (err) {
      const { message } = err || {}
      message && enqueueSnackbar(messages[message] ? intl.formatMessage(messages[message]) : message)
    }
  }, [bookingFromRef, enqueueSnackbar, handleClose, intl, saveCertificate, user.display, values])
  
  return (
    <Dialog
      aria-describedby="scroll-confirm-dialog-description"
      aria-labelledby="scroll-confirm-dialog-title"
      maxWidth="lg"
      onClose={handleClose}
      open={open}
      scroll="paper"
    >
      <div style={{ minWidth: 500 }}>
        <DialogTitle className={classes.dialogTitle} disableTypography id="scroll-confirm-dialog-title">
          <Typography variant="h5">
            <FormattedMessage defaultMessage="Review booking" id="booking.confirm_data_title"/>
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent} dividers>
          <DataLayout values={values}/>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button color="default" onClick={handleClose} size="small">
            {intl.formatMessage(messages['common_cancel'])}
          </Button>
          <Button color="secondary" onClick={save} size="small">
            {intl.formatMessage(messages['common_save'])}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
