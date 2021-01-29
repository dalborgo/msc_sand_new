import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    overflowY: props => props.overflowY ? props.overflowY : 'hidden',
    overflowX: 'auto',
    height: 0, // hack si muove al caricamento
  },
  innerFirst: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1, 3),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
}))
const DivContentWrapper = ({ children, contentProps = {} }) => {
  const classes = useStyles(contentProps)
  return (
    <div className={classes.content}>
      <div className={classes.innerFirst}>
        {children}
      </div>
    </div>
  )
}

export default DivContentWrapper
