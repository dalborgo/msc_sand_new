import React from 'react'
import { ToggleButtonGroup as MuiToggleButtonGroup } from 'formik-material-ui-lab'

const MandatoryToggleButtonGroup = props => {
  const {
    form: { setFieldValue },
    field: { name },
  } = props
  const onChange = React.useCallback(
    (event, value) => {
      value && setFieldValue(name, value)
    },
    [setFieldValue, name]
  )
  return <MuiToggleButtonGroup {...props} onChange={onChange}/>
}

export default MandatoryToggleButtonGroup
