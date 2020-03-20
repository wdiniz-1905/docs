import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    height: 93,
    width: 'calc(100% - 210px)',
    borderTop: 'solid 1px #bdc3d0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    height: '100%',
    width: 190,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  counter: {
    width: 42,
    height: 26,
    borderRadius: 32.5,
    backgroundColor: '#00a8a2',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.09)',
    marginRight: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  counterDescription: {
    fontSize: theme.typography.pxToRem(16),
  },
  buttonsContainer: {
    height: '100%',
    width: 'calc(100% - 180px)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    height: 45,
    borderRadius:  22,
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(16),
    padding: '8px 16px 8px 16px',
    
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    color: '#30353e',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#ccc',
    },
  },
  buttonConfirm: {
    backgroundColor: '#3c414d',
    marginLeft: 2 * theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#3c414d',
    },
  },
})

class ListViewFinish extends React.Component {
  static propTypes = {
    confirmButton: PropTypes.object,
    cancelButton: PropTypes.object,
  }

  renderButton (type, button) {
    const { classes } = this.props
    return (
      <Button
        variant='raised'
        color='primary'
        className={classNames(
          classes.button,
          (type === 'cancel' && classes.buttonCancel),
          (type === 'confirm' && classes.buttonConfirm)
        )}
        onClick={button.onClick}
      >
        {button.description}
      </Button>
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.counterContainer}>
          <span className={classes.counter}>
            {this.props.counter}
          </span>
          <span className={classes.counterDescription}>
            {(this.props.counter > 1 && 'THINGS') || 'THING'} SELECTED
          </span>
        </div>
        <div className={classes.buttonsContainer}>
          { this.props.cancelButton !== undefined && this.renderButton('cancel', this.props.cancelButton, this.props.onCancelClick) }
          { this.props.confirmButton !== undefined && this.renderButton('confirm', this.props.confirmButton, this.props.onConfirmClick) }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ListViewFinish)
