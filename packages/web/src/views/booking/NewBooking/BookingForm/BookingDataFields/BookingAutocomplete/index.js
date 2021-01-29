import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core'
import { Field } from 'formik'
import Grid from '@material-ui/core/Grid'
import { Autocomplete } from 'material-ui-formik-components/Autocomplete'
import parse from 'autosuggest-highlight/parse'
import match from 'src/utils/matcher'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'

const useStyles = makeStyles(() => ({
  listBox: { overflowX: 'hidden' },
}))

const BookingAutocomplete = memo(({ list, name, label, onChange }) => {
  const classes = useStyles()
  const intl = useIntl()
  return (
    <Field
      classes={
        {
          listbox: classes.listBox,
        }
      }
      component={Autocomplete}
      getOptionLabel={option => `${option.value.trim()}${option.key ? ` (${option.key})` : ''}`}
      getOptionSelected={(option, value) => option.value === value.value}
      name={name}
      noOptionsText={intl.formatMessage(messages['common_no_options'])}
      onChange={onChange}
      options={list}
      renderOption={
        (option, { inputValue }) => {
          let partsName
          if(option.key){
            const text = `${option.value} (${option.key})`
            partsName = parse(text, match(text, inputValue))
          } else{
            partsName = parse(option.value, match(option.value, inputValue))
          }
          
          return (
            <Grid alignItems="center" container>
              <Grid
                item
                xs={12}
              >
                {
                  partsName.map((part, index) => (
                    <span
                      key={index}
                      style={{ fontWeight: part.highlight ? 700 : 400 }}
                    >
                      {part.text}
                    </span>
                  ))
                }
              </Grid>
            </Grid>
          )
        }
      }
      required
      textFieldProps={
        {
          label,
          variant: 'outlined',
          margin: 'none',
          required: true,
        }
      }
    />
  )
})

BookingAutocomplete.displayName = 'BookingAutocomplete'

export default BookingAutocomplete
