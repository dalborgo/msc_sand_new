import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Breadcrumbs, Grid, Link, makeStyles, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { FormattedMessage } from 'react-intl'

const useStyles = makeStyles(() => ({
  root: {},
}))

const Header = ({ className, ...rest }) => {
  const classes = useStyles()
  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon fontSize="small"/>}
        >
          <Link
            color="inherit"
            component={RouterLink}
            to="/app"
            variant="body1"
          >
            Dashboard
          </Link>
          <Typography
            color="textPrimary"
            variant="body1"
          >
            Reports
          </Typography>
        </Breadcrumbs>
        <Typography
          color="textPrimary"
          variant="h3"
        >
          <FormattedMessage defaultMessage="Dashboard" id="dashboard.title"/>
        </Typography>
      </Grid>
      <Grid item/>
    </Grid>
  )
}

Header.propTypes = {
  className: PropTypes.string,
}

export default Header
