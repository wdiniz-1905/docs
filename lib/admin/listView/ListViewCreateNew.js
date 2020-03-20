import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  button: {
    height: 45,
    borderRadius:  22,
    padding: '8px 24px 8px 16px',
  },
})


class ListViewCreateNew extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    icon: PropTypes.element,
    onClick: PropTypes.func,
  }
  
  render () {
    const { classes } = this.props

    return (
      <Button
        variant='raised'
        color='primary'
        type='submit'
        className={classes.button}
        onClick={this.props.onClick}
      >
        {this.props.icon}
        {this.props.label || 'Create new'}
      </Button>
    )
  }
}

export default withStyles(styles)(ListViewCreateNew)
