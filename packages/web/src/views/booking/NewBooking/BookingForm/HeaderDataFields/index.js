import React, { memo } from 'react'
import { FastField } from 'formik'
import { Grid, TextField as TF } from '@material-ui/core'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'

const HeaderDataFields = () => {
  const intl = useIntl()
  return (
    <Grid alignItems="center" container>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_sender'])}
          name="sender"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_recipient'])}
          name="recipient"
        />
      </Grid>
    </Grid>
  )
}

export default memo(HeaderDataFields)
