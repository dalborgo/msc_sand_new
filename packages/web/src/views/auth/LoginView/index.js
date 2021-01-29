import React, { useMemo } from 'react'
import { Box, Card, CardContent, Container, makeStyles, Typography } from '@material-ui/core'
import Page from 'src/components/Page'
import useAuth from 'src/hooks/useAuth'
import useSettings from 'src/hooks/useSettings'
import { FormattedMessage } from 'react-intl'
import JWTLogin from './JWTLogin'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  banner: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  bannerChip: {
    marginRight: theme.spacing(2),
  },
  methodIcon: {
    height: 30,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  cardContainer: {
    paddingBottom: 80,
    paddingTop: 80,
    height: '100%',
  },
  cardContent: {
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400,
  },
  currentMethodIcon: {
    height: 40,
    '& > img': {
      width: 'auto',
      maxHeight: '100%',
    },
  },
}))

const LoginView = () => {
  const classes = useStyles()
  const { method } = useAuth()
  const { settings: { theme } } = useSettings()
  const currentLogoVariant = useMemo(() => theme === 'ONE_DARK' ? 'white' : 'black', [theme])
  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <div className={classes.banner}>
        <Container maxWidth="md">
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Box
              alignItems="center"
              display="flex"
            >
              <img alt="logo" src={`/static/images/logo_msc_${currentLogoVariant}.png`}/>
            </Box>
          </Box>
        </Container>
      </div>
      <Container
        className={classes.cardContainer}
        maxWidth="sm"
      >
        <Box
          alignItems="center"
          css={{ height: '100%' }}
          display="flex"
        >
          <Card>
            <CardContent className={classes.cardContent}>
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
              >
                <div>
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h2"
                  >
                    <FormattedMessage defaultMessage="Enter" id="auth.login.enter"/>
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    <FormattedMessage defaultMessage="Connect to the platform" id="auth.connect"/>
                  </Typography>
                </div>
                <div className={classes.currentMethodIcon}/>
              </Box>
              <Box
                flexGrow={1}
                mt={3}
              >
                {method === 'JWT' && <JWTLogin/>}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Page>
  )
}

export default LoginView
