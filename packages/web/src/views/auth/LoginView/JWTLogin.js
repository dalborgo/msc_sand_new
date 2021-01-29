import React, { memo, useCallback, useState } from 'react'
import clsx from 'clsx'
import * as Yup from 'yup'
import { FastField, Field, Formik } from 'formik'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
} from '@material-ui/core'
import { TextField } from 'formik-material-ui'
import useAuth from 'src/hooks/useAuth'
import useIsMountedRef from 'src/hooks/useIsMountedRef'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { useSnackQueryError } from 'src/utils/reactQueryFunctions'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  helperText: {
    position: 'absolute',
    bottom: -20,
  },
  field: {
    marginBottom: theme.spacing(2),
  },
}))

const focus = event => event.target.select()

const JWTLogin = memo(({ className, ...rest }) => {
  const classes = useStyles()
  const { login } = useAuth()
  const intl = useIntl()
  const [visibility, setVisibility] = useState(false)
  const handleClickShowPassword = useCallback(() => {setVisibility(!visibility)}, [visibility])
  const isMountedRef = useIsMountedRef()
  const snackQueryError = useSnackQueryError()
  return (
    <Formik
      initialValues={
        {
          password: '',
          submit: null,
          username: '',
        }
      }
      onSubmit={
        async (values, {
          setStatus,
          setSubmitting,
        }) => {
          try {
            await login(values.username, values.password)
            if (isMountedRef.current) {
              setStatus({ success: true })
              setSubmitting(false)
            }
          } catch (err) {
            snackQueryError(err)
            if (isMountedRef.current) {
              setStatus({ success: false })
              setSubmitting(false)
            }
          }
        }
      }
      validationSchema={
        Yup.object().nullable().shape({
          username: Yup.string().required(intl.formatMessage(messages.username_required)),
          password: Yup.string().required(intl.formatMessage(messages.password_required)),
        })
      }
    >
      {
        ({
          dirty,
          errors,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          touched,
          values,
        }) => (
          <form
            className={clsx(classes.root, className)}
            noValidate
            onSubmit={handleSubmit}
            {...rest}
          >
            <FastField
              autoFocus
              className={classes.field}
              component={TextField}
              FormHelperTextProps={
                {
                  classes: { root: classes.helperText },
                }
              }
              fullWidth
              label={intl.formatMessage(messages.common_username)}
              margin="normal"
              name="username"
              onChange={handleChange}
              onFocus={focus}
              required
              size="medium"
              type="text"
              value={values.username}
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel
                error={errors.password && touched.password}
                htmlFor="outlined-adornment-password"
                required
              >Password
              </InputLabel>
              <Field
                as={OutlinedInput}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPassword}
                      tabIndex="-1"
                    >
                      {visibility ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
                error={errors.password && touched.password}
                label="Password"
                name="password"
                onFocus={focus}
                required
                type={visibility ? 'text' : 'password'}
              />
              {
                errors.password && touched.password
                  ?
                  <FormHelperText
                    className={classes.helperText}
                    error
                    id="username-helper-text"
                  >
                    {errors.password}
                  </FormHelperText>
                  : null
              }
            </FormControl>
            <Box mt={3}>
              <Button
                color="secondary"
                disabled={isSubmitting || !isValid || !dirty}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                <FormattedMessage defaultMessage="Enter" id="auth.login.enter"/>
              </Button>
            </Box>
          </form>
        )
      }
    </Formik>
  )
})

JWTLogin.displayName = 'JWTLogin'

export default JWTLogin
