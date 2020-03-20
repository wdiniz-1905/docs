import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  loading: {
    position: 'absolute',
    top: 56,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(2px)',
  },
})

class ListViewViewArea extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <h1>Olar!!!</h1>

        { this.props.loading &&
          <div className={classNames('js-loading', classes.loading)}>
            <CircularProgress size={40} />
          </div>
        }
      </div>
    )
  }
}

export default connect()(withStyles(styles)(ListViewViewArea))
