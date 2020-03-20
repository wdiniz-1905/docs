import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { ArrowLeft, Close } from 'mdi-material-ui'
import { LTitle, LIconButton } from 'lumen-web-sdk'

const styles = theme => ({
  root: {
    width: '100%',
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
  },
  button: {
    width: 105,
    minWidth: 105,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class DocHeader extends React.Component {
  static propTypes = {
    mainDescription: PropTypes.string.isRequired,
    onPreviousButtonClick: PropTypes.func,
    onCloseButtonClick: PropTypes.func,
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.button}>
          { this.props.onPreviousButtonClick &&
            <LIconButton icon={<ArrowLeft />} showBorder onClick={this.props.onPreviousButtonClick}/>}
        </div>

        <div className={classes.content}>
          <LTitle level={5} align='center' overflow='ellipsis' nomargin>
            { this.props.mainDescription }
          </LTitle>
        </div>

        <div className={classes.button}>
          { this.props.onCloseButtonClick &&
            <LIconButton icon={<Close />} showBorder onClick={this.props.onCloseButtonClick}/>}
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(DocHeader)
