import React, { memo } from 'react'
import { Button, ListItemIcon, makeStyles, Menu, MenuItem, SvgIcon } from '@material-ui/core'
import { Download as DownloadIcon } from 'react-feather'
import { FileText as FileTextIcon } from 'react-feather'
import { FormattedMessage, useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'

const useStyles = makeStyles(() => ({
  popover: {
    width: 200,
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
  },
}))

const ExportMenu = ({ handleExport, setAnchorEl, onClose, anchorEl }) => {
  const classes = useStyles()
  const intl = useIntl()
  const onClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <>
      <Button
        aria-controls="export-menu"
        aria-haspopup="true"
        color="default"
        disableFocusRipple
        onClick={onClick}
        size="small"
        variant="contained"
      >
        <SvgIcon fontSize="small">
          <DownloadIcon/>
        </SvgIcon>
        &nbsp;&nbsp;<FormattedMessage defaultMessage="Export" id="common.export"/>
      </Button>
      <Menu
        anchorEl={anchorEl}
        disableAutoFocusItem
        getContentAnchorEl={null}
        id="export-menu"
        keepMounted
        onClose={onClose}
        open={Boolean(anchorEl)}
        PaperProps={{ className: classes.popover }}
        transitionDuration={0}
      >
        <MenuItem
          dense
          id="exportBooking"
          onClick={handleExport}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <FileTextIcon/>
            </SvgIcon>
          </ListItemIcon>
          {intl.formatMessage(messages['certificates_export_booking'])}
        </MenuItem>
        <MenuItem
          dense
          id="exportContainers"
          onClick={handleExport}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <FileTextIcon/>
            </SvgIcon>
          </ListItemIcon>
          {intl.formatMessage(messages['certificates_export_containers'])}
        </MenuItem>
      </Menu>
    </>
  )
}

export default memo(ExportMenu)



