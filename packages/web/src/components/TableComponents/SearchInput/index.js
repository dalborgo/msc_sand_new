import React from 'react'
import { IconButton, InputAdornment, withStyles } from '@material-ui/core'
import { SearchPanel } from '@devexpress/dx-react-grid-material-ui'
import CloseIcon from '@material-ui/icons/Close'

const styles = () => ({
  root: {
    fontSize: '0.9rem',
  },
})

export const SearchInput = withStyles(styles)(({ classes, ...rest }) => (
  <SearchPanel.Input
    {...rest}
    classes={
      {
        root: classes.root,
      }
    }
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          onClick={() => rest.onValueChange('')}
        >
          <CloseIcon fontSize="small"/>
        </IconButton>
      </InputAdornment>
    }
    onFocus={event => event.target.select()}
    style={{ maxWidth: 240 }}
  />
))
