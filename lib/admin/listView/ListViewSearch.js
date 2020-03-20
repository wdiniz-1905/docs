import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Magnify } from 'mdi-material-ui'

const styles = theme => ({
  root: {
    display: 'inline-block',
    height: 34,
    verticalAlign: 'top',
    borderRadius: 2,
    position: 'relative',
    borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
  },
  input: {
    width: 180,
    backgroundColor: 'transparent',
    border: 0,
    lineHeight: '30px',
    padding: '2px 16px 2px 32px',
    fontSize: '0.875rem',
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&::placeholder': {
      color: '#9b9b9b',
    },
    '&:focus::placeholder': {
      color: 'rgba(0, 0, 0, 0)',
    },
  },
  lupe: {
    position: 'absolute',
      color: '#4a4a4a',
      margin: 5,
  },
})


class ListViewSearch extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) { // enter
      this.props.onSearch(e.currentTarget.value)
    }
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Magnify
          className={classes.lupe}
        />

        <input
          type='text'
          className={classes.input}
          placeholder={this.props.placeholder || 'Search'}
          ref={this.searchInput}
          onKeyDown={this.handleKeyDown}
        />
      </div>
    )
  }
}

export default withStyles(styles)(ListViewSearch)
