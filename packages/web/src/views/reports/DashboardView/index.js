import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import Page from 'src/components/Page'
import Paper from '@material-ui/core/Paper'
import DivContentWrapper from 'src/components/DivContentWrapper'
import { StandardBreadcrumb } from 'src/components/StandardBreadcrumb'
import { FormattedMessage } from 'react-intl'
import StandardHeader from 'src/components/StandardHeader'

const useStyles = makeStyles(theme => ({
  paper: {
    height: '100%',
  },
  container: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: { // mobile
      padding: theme.spacing(0, 2),
    },
  },
}))

const DashboardView = () => {
  const classes = useStyles()
  
  return (
    <Page
      title="Dashboard"
    >
      <div className={classes.container}>
        <StandardHeader
          breadcrumb={
            <StandardBreadcrumb
              crumbs={[{ name: 'Home' }]}
            />
          }
        >
          <FormattedMessage defaultMessage="Dashboard" id="dashboard.title"/>
        </StandardHeader>
      </div>
      <DivContentWrapper>
        <Paper className={classes.paper}>
          <Box alignItems="center" display="flex" justifyContent="center" p={4}>
            <img alt="back_logo" src="/static/images/theWorld.png"/>
          </Box>
        </Paper>
      </DivContentWrapper>
    </Page>
  )
}

export default DashboardView
