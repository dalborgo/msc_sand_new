import React, { memo } from 'react'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import isNumber from 'lodash/isNumber'

const typoStyle = theme => ({
  root: {
    fontWeight: props => props.bold ? 'bold' : 'normal',
    marginRight: props => props.mr ? theme.spacing(isNumber(props.mr) || 1) : 0,
  },
})

const Typo = withStyles(typoStyle)(props => {
  const { children, classes } = props
  return (
    <Typography
      className={classes.root}
      display="inline"
      variant="body2"
    >
      {children}
    </Typography>
  )
})

const StatsList = ({ stats }) => {
  const { total = 0, totalImportantCustomers = 0 } = stats || {}
  const normalCustomers = total && totalImportantCustomers ? total - totalImportantCustomers : ''
  return (
    <Grid container>
      <Grid item style={{ minWidth: 170 }}>
        <Typo mr>
          <FormattedMessage defaultMessage="Total certificates:" id="certificates.stats_total"/>
        </Typo>
        <Typo bold>
          {stats?.total}
        </Typo>
      </Grid>
      <Grid item style={{ minWidth: 170 }}>
        <Typo mr>
          <FormattedMessage defaultMessage="Total containers:" id="certificates.stats_total_containers"/>
        </Typo>
        <Typo bold>
          {stats?.totalContainers}
        </Typo>
      </Grid>
      <Grid item style={{ minWidth: 195 }}>
        <Typo mr>
          <FormattedMessage defaultMessage="Important customers:" id="certificates.stats_important_customers"/>
        </Typo>
        <Typo bold>
          {stats?.totalImportantCustomers}
        </Typo>
      </Grid>
      <Grid item style={{ minWidth: 195 }}>
        <Typo mr>
          <FormattedMessage defaultMessage="Normal customers:" id="certificates.stats_normal_customers"/>
        </Typo>
        <Typo bold>
          {normalCustomers}
        </Typo>
      </Grid>
    </Grid>
  )
}

export default memo(StatsList)


