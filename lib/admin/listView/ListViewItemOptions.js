import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { DotsHorizontal } from 'mdi-material-ui'

const styles = theme => ({
  root: {
  },
  item: {
    paddingTop: 0.5 * theme.spacing.unit,
    paddingBottom: 0.5 * theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
    minWidth: 140,
  },
  labelContainer: {
    padding: 0,
  },
  label: {
    fontSize: theme.typography.pxToRem(14),
  },
})


class ListViewTableItemOptions extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
    item: PropTypes.object,
    listView: PropTypes.object,
  }

  state = {
    anchorEl: null,
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  }

  handleActionClick = (action) => {
    if (action.action)
      action.action(this.props.item, this.props.listView)

    this.handleClose()
  }

  render () {
    const { classes } = this.props
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          style={{padding: 0}}
          onClick={this.handleClick}
        >
          <DotsHorizontal />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.props.actions.map((action) => {
            return (
              <MenuItem
                key={action.label}
                className={classes.item}
                onClick={() => {this.handleActionClick(action)}}
              >
                <ListItemIcon>
                  {action.icon}
                </ListItemIcon>
                <ListItemText
                  classes={{
                    root: classes.labelContainer,
                    primary: classes.label,
                  }}
                  primary={action.label}
                />
              </MenuItem>
            )
          })}
          
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)(ListViewTableItemOptions)
