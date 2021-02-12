import React, { memo } from 'react'
import { FastField, FieldArray } from 'formik'
import { Box, Grid, IconButton, makeStyles, TextField as TF } from '@material-ui/core'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { Add, Remove } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  iconButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0),
  },
}))
const HeaderDataFields = ({ recipients }) => {
  const classes = useStyles()
  const intl = useIntl()
  return (
    <Grid container>
      <Grid item sm={6} xs={12}>
        <FastField
          as={TF}
          fullWidth
          label={intl.formatMessage(messages['booking_sender'])}
          name="sender"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <FieldArray
          name="recipients"
          render={
            arrayHelpers => (
              <Box>
                {
                  recipients.map((recipient, index) => (
                    <Box display="flex" key={index} mb={index < recipients.length - 1 ? 1 : 0}>
                      <FastField
                        as={TF}
                        fullWidth
                        label={intl.formatMessage(messages['booking_recipient'])}
                        name={`recipients.${index}`}
                      />
                      {
                        index === 0 ?
                          <IconButton
                            className={classes.iconButton}
                            color="secondary"
                            onClick={
                              () => {
                                arrayHelpers.push('')
                              }
                            }
                            size="small"
                            tabIndex={-1}
                          >
                            <Add/>
                          </IconButton>
                          :
                          <IconButton
                            className={classes.iconButton}
                            color="secondary"
                            onClick={
                              () => arrayHelpers.remove(index)
                            }
                            size="small"
                            tabIndex={-1}
                          >
                            <Remove/>
                          </IconButton>
                      }
                    </Box>
                  ))
                }
              </Box>
            )
          }
        />
      </Grid>
    </Grid>
  )
}

export default memo(HeaderDataFields)
