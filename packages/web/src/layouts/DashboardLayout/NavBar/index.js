import React, { useEffect, useRef } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { PerfectScrollbarWithHotfix as PerfectScrollbar } from 'src/utils/PerfectScrollbarWithHotfix'
import PropTypes from 'prop-types'
import sections from './sections'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core'
import useAuth from 'src/hooks/useAuth'
import NavItem from './NavItem'
import { isMenuLinkToShow } from 'src/utils/logics'
import { messages } from 'src/translations/messages'
import { useIntl } from 'react-intl'
import { useRoleFormatter } from 'src/utils/formatters'

function renderNavItems ({
  depth = 0,
  intl,
  items,
  pathname,
  priority,
}) {
  
  return (
    <List disablePadding>
      {
        items.reduce(
          (acc, item) => {
            if (isMenuLinkToShow(item, { priority })) {
              return reduceChildRoutes({ acc, item, pathname, depth, intl })
            }
            return acc
          },
          []
        )
      }
    </List>
  )
}

function reduceChildRoutes ({
  acc,
  pathname,
  intl,
  item,
  depth,
}) {
  const key = item.title + depth
  
  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    })
    
    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={messages[`menu_${item.title}`] ? intl.formatMessage(messages[`menu_${item.title}`]) : item.title}
      >
        {
          renderNavItems({
            depth: depth + 1,
            pathname,
            items: item.items,
          })
        }
      </NavItem>
    )
  } else {
    acc.push(
      <NavItem
        depth={depth}
        exact={item.exact}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={messages[`menu_${item.title}`] ? intl.formatMessage(messages[`menu_${item.title}`]) : item.title}
      />
    )
  }
  
  return acc
}

const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    width: 64,
    height: 64,
  },
  subheader: {
    paddingTop: theme.spacing(1),
    paddingBottom: 0,
    lineHeight: 2,
  },
}))

const NavBar = ({ setMobileNavOpen, openMobile }) => {
  const classes = useStyles()
  const location = useLocation()
  const { user } = useAuth()
  const PerfectScrollbarRef = useRef(null)
  const roleFormatter = useRoleFormatter()
  const intl = useIntl()
  useEffect(() => {
    if (openMobile && setMobileNavOpen) {
      setMobileNavOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <PerfectScrollbar options={{ suppressScrollX: true }} ref={PerfectScrollbarRef}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box p={2} pt={3}>
            <Box
              display="flex"
              justifyContent="center"
            >
              <Avatar
                alt="User"
                className={classes.avatar}
                src={`/static/images/avatars/${user?.priority}.png`}
                variant="rounded"
              />
            </Box>
            <Box
              mt={1}
              textAlign="center"
            >
              <Typography
                variant="h5"
              >
                {user?.display}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {roleFormatter(user?.priority)}
              </Typography>
            </Box>
          </Box>
          <Divider/>
          <Box p={2} pt={1}>
            {
              sections.map(section => (
                <List
                  key={section.subheader}
                  subheader={
                    (
                      <ListSubheader
                        className={classes.subheader}
                        disableGutters
                        disableSticky
                      >
                        {messages[`sub_${section.subheader}`] ? intl.formatMessage(messages[`sub_${section.subheader}`]) : section.subheader}
                      </ListSubheader>
                    )
                  }
                >
                  {
                    renderNavItems({
                      intl,
                      items: section.items,
                      pathname: location.pathname,
                      priority: user?.priority,
                    })
                  }
                </List>
              ))
            }
          </Box>
          {/* <Box flexGrow={1}/>
          <Divider/>
          <Box p={2}>
            <Box
              bgcolor="background.dark"
              borderRadius="borderRadius"
              p={2}
            >
              <Typography
                color="textPrimary"
                variant="h6"
              >
                Need Help?
              </Typography>
              <Link
                color="secondary"
                component={RouterLink}
                to="/docs"
                variant="subtitle1"
              >
                Check our docs
              </Link>
            </Box>
          </Box>*/}
        </Box>
      </PerfectScrollbar>
    </Box>
  )
  
  return (
    <>
      <Hidden lgUp>
        <SwipeableDrawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          disableBackdropTransition
          hysteresis={0.01}
          onClose={() => setMobileNavOpen(false)}
          onOpen={() => setMobileNavOpen(true)}
          open={openMobile}
          style={{ touchAction: 'none' }}
          swipeAreaWidth={10}
          variant="temporary"
        >
          {content}
        </SwipeableDrawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}

NavBar.propTypes = {
  openMobile: PropTypes.bool,
  onMobileClose: PropTypes.func,
}

export default NavBar
