import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import { LButton } from 'lumen-web-sdk'
import { ViewGrid, ViewList, Refresh } from 'mdi-material-ui'
import i18n from './../../../../i18n'

const styles = theme => ({
  toggleButton: {
    opacity: 0.2,
    width: 32,
    height: 32,
    color: '#000',
    padding: 0,
  },
  selected: {
    opacity: 1,
  },
  refreshButton: {
    height: 32,
    minHeight: 32,
    fontSize: theme.typography.pxToRem(12),
    textTransform: 'none',
    borderRadius: 22.5,
    color: '#000',
    backgroundColor: '#ffffff',
    margin: 0,
    marginRight: 15,
    padding: '4px 8px 4px 8px',
  },
  refreshIcon: {
    width: 18,
    height: 18,
  },
})

class ListViewToggle extends React.Component {
  static propTypes = {
    visualizationType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onRefreshClick: PropTypes.func,
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        {this.props.refreshButton &&
          <LButton
            label={i18n.t('analytics:refresh')}
            icon={<Refresh />}
            size='small'
            kind='secondary'
            onClick={() => this.props.onRefreshClick()}
          />
        }
        {this.props.allowedVisualizations.includes('grid') &&
          <IconButton
            className={classNames(classes.toggleButton, this.props.visualizationType === 'grid' && classes.selected)}
            onClick={() => this.props.onChange('grid')}
          >
            <ViewGrid />
          </IconButton>
        }

        {this.props.allowedVisualizations.includes('list') &&
          <IconButton
            className={classNames(classes.toggleButton, this.props.visualizationType === 'list' && classes.selected)}
            onClick={() => this.props.onChange('list')}
          >
            <ViewList />
          </IconButton>
        }

        {this.props.allowedVisualizations.includes('listCard') &&
          <IconButton
            className={classNames(classes.toggleButton, this.props.visualizationType === 'listCard' && classes.selected)}
            onClick={() => this.props.onChange('listCard')}
          >
            <ViewList />
          </IconButton>
        }
        
      </div>
    )
  }
}

export default withStyles(styles)(ListViewToggle)
