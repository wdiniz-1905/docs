import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import TablePagination from '@material-ui/core/TablePagination'
import { Pencil } from 'mdi-material-ui'

import ListViewGridItem from './ListViewGridItem'
import { LTitle } from 'lumen-web-sdk'

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative',
    minHeight: 200,
  },
  gridView: {
    display: 'grid',
    gridGap: '10px',
    marginTop: 2 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
  },
  gridViewDefault: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  gridViewSmall: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
  gridViewThin: {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  },
  categorization: {
    display: 'flex',
  },
  gridViewDivider: {
    paddingBottom: 2 * theme.spacing.unit,
    borderBottom: `solid 2px ${theme.palette.grey[400]}`,
  },
})

class ListViewGrid extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    gridFields: PropTypes.object,
    gridSize: PropTypes.string,
    data: PropTypes.array,
    identifierAttribute: PropTypes.string,
    listView: PropTypes.object,
    pagination: PropTypes.object,
    loading: PropTypes.bool,
    orderBy: PropTypes.string,
    order: PropTypes.string,
    onClickSort: PropTypes.func,
    onItemEdit: PropTypes.func,
    onItemClick: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
    itemActions: PropTypes.array,
    gridItemType: PropTypes.string,
    itemActionOnClick: PropTypes.string,
    categorization: PropTypes.bool,
    categorizeBy: PropTypes.string,
  }

  static defaultProps = {
    gridSize: 'default',
  }

  handleClickSort (column) {
    if (this.props.onClickSort)
      this.props.onClickSort(column)
  }

  handleItemEdit = (item) => {
    if (this.props.onItemEdit)
      this.props.onItemEdit(item)
  }

  handleViewItemClick = (item) => {
    if (this.props.onItemClick)
      this.props.onItemClick(item)
  }

  get gridViewTemplateColumns () {
    const { classes, gridSize } = this.props

    return {
      'default': classes.gridViewDefault,
      'small': classes.gridViewSmall,
      'thin': classes.gridViewThin,
    }[gridSize]
  }

  get itemActions () {
    const defaultActions = {
      edit: {label: 'Edit', icon: <Pencil />, action: this.handleItemEdit},
    }

    if (this.props.itemActions) {
      return this.props.itemActions.map(action => {
        if (typeof(action) === 'string')
          return defaultActions[action]

        return action
      })
    }

    return [
      defaultActions.edit,
    ]
  }

  renderItem (item) {
    return (
      <ListViewGridItem
        key={item[this.props.identifierAttribute]}
        item={item}
        itemsSelected={this.props.itemsSelected}
        gridFields={this.props.gridFields}
        itemActions={this.props.itemActions}
        listView={this.props.listView}
        onViewClick={this.handleViewItemClick}
        gridItemType={this.props.gridItemType}
        itemActionOnClick={this.props.itemActionOnClick}
      />
    )
  }

  renderDefaultGrid () {
    const { classes } = this.props

    return (
      <div
        className={classNames(classes.gridView, this.gridViewTemplateColumns)}
      >
        { this.props.data.map((item) => {
            return this.renderItem(item)
          })}
      </div>
    )
  }

  renderCategorization () {
    const { classes, data, categorizeBy } = this.props

    const categorys = Array.from(new Set(data.map(item => item[categorizeBy])))

    return (
      categorys.map((category) => {
        return (
          <div>
            <LTitle level={5} weigth='super-thin' nomargin>
              { category }
            </LTitle>
            <div className={classNames(classes.gridView, this.gridViewTemplateColumns, classes.gridViewDivider)}>
              { data.filter(item => item[categorizeBy] === category)
                  .map((item) => {
                    return this.renderItem(item)
                  })
              }
            </div>
          </div>
        )
      })
    )
  }

  render () {
    const { classes, categorization } = this.props

    return (
      <div className={classes.root}>
        { (categorization && this.renderCategorization()) || this.renderDefaultGrid() }

        <TablePagination
          component='div'
          count={this.props.pagination.totalItems}
          rowsPerPage={this.props.pagination.pageSize}
          page={this.props.pagination.currentPage - 1}
          onChangePage={this.props.onChangePage}
          onChangeRowsPerPage={this.props.onChangeRowsPerPage}
        />
      </div>
    )
  }
}

export default withStyles(styles)(ListViewGrid)
