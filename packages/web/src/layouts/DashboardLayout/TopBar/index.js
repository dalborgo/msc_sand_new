import React, { memo, useMemo } from 'react'
import { AppBar, Box, Hidden, IconButton, makeStyles, SvgIcon, Toolbar } from '@material-ui/core'
import { Menu as MenuIcon } from 'react-feather'
import { THEMES } from 'src/constants'
import Account from './Account'
import Settings from './Settings'
import useSettings from 'src/hooks/useSettings'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 100,
    ...theme.name === THEMES.LIGHT ?
      {
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.main,
      }
      : {},
    ...theme.name === THEMES.ONE_DARK ?
      {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.default,
      }
      : {},
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  toolbar: {
    minHeight: 64,
    [theme.breakpoints.down('sm')]: {
      minHeight: 32,
    },
  },
  logo: {
    [theme.breakpoints.down('sm')]: {
      height: 40,
    },
  },
}))

const TopBar = ({
  setMobileNavOpen,
}) => {
  const classes = useStyles()
  const { settings: { theme } } = useSettings()
  const currentLogoVariant = useMemo(() => theme === 'ONE_DARK' ? 'white' : 'black', [theme])
  return (
    <AppBar
      className={classes.root}
    >
      <Toolbar
        className={classes.toolbar}
        id="dashboardTopBar"
      >
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={() => setMobileNavOpen(true)}
          >
            <SvgIcon fontSize="small">
              <MenuIcon/>
            </SvgIcon>
          </IconButton>
        </Hidden>
        <img alt="logo" className={classes.logo} src={`/static/images/logo_msc_${currentLogoVariant}.png`}/>
        <Box
          flexGrow={1}
          ml={2}
        />
        <Settings/>
        <Box ml={2}>
          <Account/>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default memo(TopBar)
