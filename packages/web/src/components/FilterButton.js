import React, { memo } from 'react'
import { Button, createMuiTheme, SvgIcon, ThemeProvider } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { Filter as FilterIcon } from 'react-feather'
import { FormattedMessage } from 'react-intl'

export default memo(function FilterButton ({ isActive, onClick }) {
  return (
    <ThemeProvider
      theme={
        createMuiTheme({
          palette: {
            secondary: {
              main: red[500],
            },
          },
        })
      }
    >
      <Button
        color={isActive ? 'secondary' : 'default'}
        disableFocusRipple //necessario perché c'è una sovrascrittura del tema
        onClick={onClick}
        size="small"
        style={
          {
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
          }
        }
        variant="contained"
      >
        <SvgIcon fontSize="small">
          <FilterIcon/>
        </SvgIcon>
        &nbsp;&nbsp;<FormattedMessage defaultMessage="Filters" id="common.filters"/>
      </Button>
    </ThemeProvider>
  )
})
