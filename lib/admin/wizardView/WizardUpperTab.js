import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import { ArrowLeft, Close } from 'mdi-material-ui'
import IconButton from '@material-ui/core/IconButton'

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonContainer: {
    width: 105,
    minWidth: 105,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  buttonStyle: {
    width: 42,
    height: 42,
    borderRadius: 4,
    border: 'solid 1px #3c414d',
    '& svg': {
      color: '#3c414d',
    },
    padding: 0,
  },
  descriptionContainer: {
    width: '100%',
    padding: 16,
    borderBottom: 'solid 1px #bdc3d0',
  },
  description: {
    fontWeight: 500,
    textAlign: 'center',
    color: '#30353e',
    margin: 0,
    '&:not(:first-child)': {
      marginTop: theme.spacing.unit,
    },
  },
  secondaryDescription: {
    color: '#7b8399',
  },
})

class WizardUpperTab extends React.Component {
  static propTypes = {
    mainDescription: PropTypes.string.isRequired,
    subDescription: PropTypes.string,
    previousButton: PropTypes.bool,
    previousButtonClick: PropTypes.func,
    closeButton: PropTypes.bool,
    closeButtonClick: PropTypes.func,
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.buttonContainer}>
          { this.props.previousButton &&
            <IconButton
              className={classes.buttonStyle}
              onClick={this.props.previousButtonClick}
            >
              <ArrowLeft />
            </IconButton>
          }
        </div>

        <div className={classes.descriptionContainer}>
          <h2 className={classes.description}>
            {this.props.mainDescription}
          </h2>
          <h4 className={classNames(classes.description, classes.secondaryDescription)}>
            {this.props.subDescription}
          </h4>
        </div>

        <div className={classes.buttonContainer}>
          { this.props.closeButton &&
            <IconButton
              className={classes.buttonStyle}
              onClick={this.props.closeButtonClick}
            >
              <Close />
            </IconButton>
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(WizardUpperTab)
