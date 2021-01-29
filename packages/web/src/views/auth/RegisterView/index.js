import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Link,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core'
import Page from 'src/components/Page'
import Logo from 'src/components/Logo'
import useAuth from 'src/hooks/useAuth'
import JWTRegister from './JWTRegister'

const methodIcons = {
  JWT: '/static/images/jwt.svg',
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  banner: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
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

const RegisterView = () => {
  const classes = useStyles()
  const { method } = useAuth()
  
  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <div className={classes.banner}>
        <Container maxWidth="md">
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Chip
              className={classes.bannerChip}
              color="secondary"
              label="NEW"
              size="small"
            />
            <Box
              alignItems="center"
              display="flex"
            >
              <Typography
                color="textPrimary"
                variant="h6"
              >
                Visit our
                {' '}
                <Link
                  component={RouterLink}
                  to="/docs"
                >
                  docs
                </Link>
                {' '}
                and find out how to switch between
              </Typography>
              <Tooltip title="JSON Web Token">
                <img
                  alt="JWT"
                  className={classes.methodIcon}
                  src={methodIcons['JWT']}
                />
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </div>
      <Container
        className={classes.cardContainer}
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="center"
          mb={8}
        >
          <RouterLink to="/">
            <Logo/>
          </RouterLink>
        </Box>
        <Card>
          <CardContent className={classes.cardContent}>
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              mb={3}
            >
              <div>
                <Typography
                  color="textPrimary"
                  gutterBottom
                  variant="h2"
                >
                  Register
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  Register on the internal platform
                </Typography>
              </div>
              <div className={classes.currentMethodIcon}>
                <img
                  alt="Auth method"
                  src={methodIcons[method]}
                />
              </div>
            </Box>
            <Box
              flexGrow={1}
              mt={3}
            >
              {method === 'JWT' && <JWTRegister/>}
            </Box>
            <Box my={3}>
              <Divider/>
            </Box>
            <Link
              color="textSecondary"
              component={RouterLink}
              to="/login"
              variant="body2"
            >
              Having an account
            </Link>
          </CardContent>
        </Card>
      </Container>
    </Page>
  )
}

export default RegisterView
