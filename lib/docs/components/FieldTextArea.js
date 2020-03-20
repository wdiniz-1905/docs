import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import PropTypes from 'prop-types'

const styles = theme => ({
  formControl: {
    width: '100%',
    height: 100,
    flexGrow: 1,
    flexBasis: 0,
  },
  textarea: {
    display: 'inline-flex',
    marginTop: 2 * theme.spacing.unit + 2,
    width: '100%',
    height: 100,
    borderRadius: 2,
    backgroundColor: '#f0f5f5',
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing.unit,
    fontSize: theme.typography.pxToRem(14),
    resize: 'none',
  },
})

class FieldTextarea extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  render () {
    const { classes } = this.props

    return (
      <FormControl
        className={classes.formControl}
      >
        <InputLabel htmlFor={this.props.id} shrink>{this.props.label}</InputLabel>
        <textarea
          id={this.props.id}
          value={this.props.value}
          onChange ={this.props.onChange}
          className={classes.textarea}
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(FieldTextarea)
