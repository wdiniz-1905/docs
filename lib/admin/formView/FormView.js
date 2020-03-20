import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { withAdmin } from '../AdminContext'
import Button from '@material-ui/core/Button'

import { ArrowLeft } from 'mdi-material-ui'

import { withLumen } from 'lumen-web-sdk'
import i18n from './../../../../i18n'

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentContainer: {
    width: 'calc(100% - 2 * 128px)', // leave space for the back button
    maxWidth: 1024,
  },
  backToListContainer: {
    maxWidth: 120,
    position: 'absolute',
    left: 0,
  },
  backToListButton: {
    color: theme.palette.text.disabled,
    textAlign: 'left',
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(12),
  },
  backToListIcon: {
    display: 'inline-block',
    border: `1px solid ${theme.palette.text.disabled}`,
    borderRadius: 2,
    marginRight: theme.spacing.unit,
    '& svg': {
      color: theme.palette.text.secondary,
      width: 16,
      height: 16,
      margin: '8px 6px',
    },
  },
  cancelButton: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
})


class FormView extends React.Component {
  static propTypes = {
    content: PropTypes.element,
  }

  handleClickBack = () => {
    this.props.lumen.navigate(this.props.admin.baseUrl)
  }

  render () {
    const { classes } = this.props
    
    return (
      <div className={classes.root}>
        <div
          className={classes.backToListContainer}
        >
          <Button
          className={classes.backToListButton}
          onClick={this.handleClickBack}
          >
            <div className={classes.backToListIcon}>
              <ArrowLeft />
            </div>
            {i18n.t('adminArea:tabs.userAdmin.BackToUserList')}
          </Button>
        </div>

        <div className={classes.contentContainer}>
          {this.props.content}

          <Button
            className={classes.cancelButton}
            onClick={this.handleClickBack}
          >
            {i18n.t('adminArea:tabs.userAdmin.cancel')}
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(withLumen(withAdmin(FormView)))
