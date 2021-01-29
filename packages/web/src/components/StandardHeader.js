import React, { memo } from 'react'
import { Grid, makeStyles, Typography, withWidth } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('sm')]: { //mobile
      padding: theme.spacing(0, 2),
    },
  },
}))

const StandardHeader = ({ children, rightComponent, breadcrumb, width }) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Grid
        alignItems="center"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Grid container spacing={3}>
            <Grid item>
              {
                (breadcrumb && width !== 'xs') && breadcrumb
              }
              <Typography
                color="textPrimary"
                variant="h4"
              >
                {children}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {
          rightComponent &&
          <Grid item>
            {rightComponent}
          </Grid>
        }
      </Grid>
    </div>
  )
}
export default memo(withWidth()(StandardHeader))
