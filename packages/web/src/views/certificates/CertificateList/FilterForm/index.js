import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FastField, Form, Formik } from 'formik'
import { Box, Button, TextField as TF } from '@material-ui/core'
import { messages } from 'src/translations/messages'
import { validation } from '@adapter/common'
import { useNewBookingStore } from 'src/zustandStore'

const { typesOfGoods } = useNewBookingStore.getState()
const FilterForm = memo(function FilterForm ({ typeOfGoods, onSubmit }) {
  console.log('%cRENDER_FORM', 'color: pink')
  const intl = useIntl()
  return (
    <Formik
      initialValues={{ typeOfGoods: typeOfGoods }}
      onSubmit={onSubmit}
    >
      {
        ({ handleChange, dirty, setValues, values }) => (
          <Form>
            <Box mb={3}>
              <FastField
                as={TF}
                fullWidth
                label={intl.formatMessage(messages['booking_type_goods'])}
                name="typeOfGoods"
                onChange={
                  event => {
                    handleChange(event)
                  }
                }
                onFocus={() => null}
                select
                SelectProps={{ native: true }}
                variant="outlined"
              >
                <option
                  key={''}
                  value={''}
                />
                {
                  typesOfGoods.map(({ value, key }) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {value}
                    </option>
                  ))
                }
              </FastField>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mr={2}>
                <Button onClick={() => setValues(validation.resetAll(values))} size="small" variant="contained">
                  <FormattedMessage defaultMessage="Clear" id="common.clear"/>
                </Button>
              </Box>
              <Box>
                <Button color="secondary" disabled={!dirty} size="small" type="submit" variant="contained">
                  <FormattedMessage defaultMessage="Apply" id="common.apply"/>
                </Button>
              </Box>
            </Box>
          </Form>
        )
      }
    </Formik>
  )
})

export default FilterForm
