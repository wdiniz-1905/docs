import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import WizardUpperTab from './WizardUpperTab'
import WizardInvalidStep from './WizardInvalidStep'

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#eeeeee',
    padding: 0,
  },
  wizardContent:{
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepContainer: {
    width: 'calc(100% - 210px)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 105,
    marginRight: 105,
    maxWidth: 1024,
  },
})

class WizardView extends React.Component {
  handlePreviousStepChange = () => {
    this.props.previousStepChange()
  }

  handleCloseStepChange = () => {
    this.props.closeStepChange()
  }

  validateNextStep () {
    if (this.props.steps.find(step => step.step === this.props.currentStep) !== undefined) {
      return this.props.steps.find(step => step.step === this.props.currentStep)
    }

    return null
  }

  render () {
    const { classes } = this.props
    const nextStep = this.validateNextStep()

    return (
      <div className={classes.root}>
      {(nextStep &&
        <div className={classes.wizardContent}>
          <WizardUpperTab
            mainDescription={this.props.mainDescription}
            subDescription={nextStep.subDescription}
            previousButton={this.props.previousButton}
            previousButtonClick={this.handlePreviousStepChange}
            closeButton={this.props.closeButton}
            closeButtonClick={this.handleCloseStepChange}
          />
          <div className={classes.stepContainer}>
            { nextStep.stepRenderer() }
          </div>
        </div>) ||
        <WizardInvalidStep />
      }
      </div>
    )
  }
}

export default withStyles(styles)(WizardView)
