import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import { Robot } from 'mdi-material-ui'

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  iconStyle: {
    width: 250,
    height: 250,
    color: theme.palette.primary.main,
  },
  erroMessageContainer:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    marginLeft: 3 * theme.spacing.unit,
  },
  erroMessage: {
    transform: 'none',
    color: theme.palette.primary.light,
    margin: 0,
    '&:not(:first-child)': {
      marginTop: theme.spacing.unit,
      color: '#7b8399',
    },
  },
})

class WizardInvalidStep extends React.Component {
  render () {
    const { classes } = this.props
    return (
    <div className={classes.root}>
      <Robot className={classes.iconStyle}/>
      <div className={classes.erroMessageContainer}>
        <h1 className={classes.erroMessage}> WHAT HAVE YOU DONE @#*%#$</h1>
        <h2 className={classes.erroMessage}>Quick, go back!!!!!</h2>
      </div>
    </div>
    )
  }
}

export default withStyles(styles)(WizardInvalidStep)