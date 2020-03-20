import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ListViewItemOptions from '../../ListViewItemOptions'
import { CheckboxMarkedCircle, Plus } from 'mdi-material-ui'

import Button from '@material-ui/core/Button'
import { LButton } from 'lumen-web-sdk'

const styles = theme => ({
  root: {
    position: 'relative',
    background: theme.palette.grey['50'],
    overflow: 'hidden',
    borderRadius: 4,
    boxShadow: '2px 2px 8px 0 rgba(0, 5, 5, 0.2)',
    '&:hover div.grid-item-image': {
      transform: 'scale(1.2)',
    },
    '&:hover div.grid-item-overlay': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
  },
  itemSizeDefault: {
    paddingBottom: '72%',
  },
  itemSizeLarge: {
    paddingBottom: '116%',
  },
  itemSelected: {
    boxShadow: `inset 0px 0px 0px 3px ${theme.palette.primary.main}`,
  },
  media: {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 58px)',
    overflow: 'hidden',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaHeightDefault: {
    height: 'calc(100% - 58px)',
  },
  mediaHeightLarge: {
    height: 'calc(100% - 110px)',
  },
  iconSelected: {
    top: 10,
    left: 10,
    position: 'absolute',
    color: theme.palette.primary.main,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  overlay: {
    position: 'absolute',
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.65)',
    transition: theme.transitions.create(['transform', 'opacity'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  button: {
    border: `1px solid ${theme.palette.primary.light}`,
    color: '#fff',
    borderRadius: 18,
    minHeight: 30,
    height: 30,
    lineHeight: '30px',
    padding: '0 32px',
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    textTransform: 'none',
  },
  content: {
    position: 'absolute',
    width: '100%',
    padding: 1.5 * theme.spacing.unit,
    display: 'flex',
  },
  contentHeightDefault: {
    top: 'calc(100% - 58px)',
    height: 58,
    flexDirection: 'row',
  },
  contentHeightLarge: {
    top: 'calc(100% - 110px)',
    height: 110,
    display: 'flex',
    flexDirection: 'column',
  },
  contentText: {
    flexGrow: 1,
  },
  contentOptions: {
    '& button': {
      width: 32,
      height: 32,
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 400,
    color: '#4a4a4a',
    margin: 0,
    marginBottom: 0.5 * theme.spacing.unit,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  extraInfo: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: 400,
    color: '#9b9b9b',
    margin: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    '&:not(:last-child)': {
      marginBottom: 0.5 * theme.spacing.unit,
    },
  },
  buttondetail: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
})

class ListViewGridItem extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    gridFields: PropTypes.object,
    itemActions: PropTypes.array,
    listView: PropTypes.object,
    onViewClick: PropTypes.func.isRequired,
    gridItemType: PropTypes.string,
    itemActionOnClick: PropTypes.string,
  }

  static defaultProps = {
    gridItemType: 'default',
  }

  get itemSize () {
    const { classes, gridItemType } = this.props

    return {
      'default': classes.itemSizeDefault,
      'detailed': classes.itemSizeLarge,
    }[gridItemType]
  }

  get itemMediaHeight () {
    const { classes, gridItemType } = this.props

    return {
      'default': classes.mediaHeightDefault,
      'detailed': classes.mediaHeightLarge,
    }[gridItemType]
  }

  get contentHeight () {
    const { classes, gridItemType } = this.props

    return {
      'default': classes.contentHeightDefault,
      'detailed': classes.contentHeightLarge,
    }[gridItemType]
  }

  get itemSelected () {
    return this.props.itemsSelected !== undefined && this.props.itemsSelected.includes(this.props.item.id)
  }

  renderGridContentMedia () {
    const { classes } = this.props

    return (
      <div className={classNames(classes.media, this.itemMediaHeight, this.props.gridFields.gridContentMedia === 'icon' && classes.icon)}>
          { this.itemSelected && <CheckboxMarkedCircle className={classes.iconSelected} /> }
          { (this.props.gridFields.gridContentMedia === 'icon' && this.props.gridFields.icon) || this.renderGridContentImage() }
        <div
          className={classNames('grid-item-overlay', classes.overlay)}
        >
          <Button
            className={classes.button}
            onClick={() => { this.props.onViewClick(this.props.item) }}
          >
            {(this.props.itemActionOnClick === 'select' && 'Select') || 'View'}
          </Button>
        </div>
      </div>
    )
  }

  renderGridContentImage () {
    const { classes } = this.props

    return (
      <div
        className={classNames('grid-item-image', classes.image)}
        style={{
          backgroundImage: `url(${this.props.item[this.props.gridFields.gridContentMedia]})`,
        }}
      ></div>
    )
  }

  renderContentActions () {
    const { classes } = this.props

      if (this.props.itemActions.length > 0) {
        return (
          <div className={classes.contentOptions}>
            <ListViewItemOptions
              actions={this.props.itemActions}
              item={this.props.item}
              listView={this.props.listView}
            />
          </div>
        )
      }
  }

  renderContentButton () {
    const { classes } = this.props

    return (
      <div className={classes.buttondetail}>
        <LButton
          label='More'
          kind='callForAction'
          icon={<Plus />}
          iconPosition='right'
          size='small'
          onClick={ () => {this.props.onViewClick(this.props.item)}}
        />
      </div>
    )
  }

  renderGridContentInfo () {
    const { classes } = this.props

    return (
      <div className={classNames(classes.content, this.contentHeight)}>
        <div className={classes.contentText}>
          <h4 className={classes.title}>{this.props.item[this.props.gridFields.title]}</h4>
          <h5 className={classes.extraInfo}>{this.props.item[this.props.gridFields.subtitle]}</h5>
          { this.props.gridItemType === 'detailed' && <h5 className={classes.extraInfo}>{this.props.item[this.props.gridFields.extraInfo]}</h5> }
        </div>

        { (this.props.gridItemType === 'detailed' && 
          this.renderContentButton()
        ) || this.renderContentActions() }
      </div>
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classNames(classes.root, this.itemSize, this.itemSelected && classes.itemSelected)}>
        { this.renderGridContentMedia() }

        { this.renderGridContentInfo() }
      </div>
    )
  }
}

export default withStyles(styles)(ListViewGridItem)
