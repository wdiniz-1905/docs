import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'
import TablePagination from '@material-ui/core/TablePagination'
import Checkbox from '@material-ui/core/Checkbox'

import ListViewItemOptions from '../../ListViewItemOptions'

const styles = theme => ({
  root: {
    width: '100%',
    position: 'relative',
    minHeight: 200,
  },
  actionTableCell: {
    width: 100,
    textAlign: 'center',
    '& button': {
      width: 32,
      height: 32,
    },
  },
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
  checkbox: {
    color: theme.palette.primary.main,
  },
})

class ListViewTable extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
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
  }

  handleClickSort (column) {
    if (this.props.onClickSort)
      this.props.onClickSort(column)
  }

  handleItemEdit = (item) => {
    if (this.props.onItemEdit)
      this.props.onItemEdit(item)
  }

  handleRowClick = (item) => {
    if (this.props.onItemClick)
      this.props.onItemClick(item)
  }

  renderHead () {
    const { classes } = this.props

    return (
      <TableHead>
        <TableRow>
          { this.props.checkboxColumn !== undefined &&
            <TableCell padding="checkbox">
            </TableCell>
          }

          {this.props.columns.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={this.props.orderBy === column.id ? this.props.order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={this.props.orderBy === column.id}
                    direction={this.props.order}
                    onClick={() => {this.handleClickSort(column.id)}}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            )
          })}

          {this.props.itemActions.length > 0 && (
            <TableCell className={classes.actionTableCell}>Action</TableCell>
          )}
        </TableRow>
      </TableHead>
    )
  }

  renderActions (item) {
    const { classes } = this.props

    return (
      <TableCell
        className={classes.actionTableCell}
      >
        <ListViewItemOptions
          actions={this.props.itemActions}
          item={item}
          listView={this.props.listView}
        />
      </TableCell>
    )
  }

  renderCellContent (item, column) {
    if (column.cellRenderer)
      return column.cellRenderer(item)

    return (
      <p>{item[column.id]}</p>
    )
  }

  renderBody () {
    const { classes } = this.props

    return (
      <TableBody>
        {this.props.data.map((item) => {
          return (
            <TableRow
              key={item[this.props.identifierAttribute]}
              hover
              onClick={event => this.handleRowClick(item)}
            >
            { this.props.checkboxColumn !== undefined &&
              <TableCell padding="checkbox">
                <Checkbox
                  className={classes.checkbox}
                  checked={this.props.itemsSelected !== undefined && this.props.itemsSelected.includes(item.id)}
                  color="primary"
                />
              </TableCell>
            }
            {this.props.columns.map(column => {
              return (
                <TableCell
                  key={column.id}
                >
                  {this.renderCellContent(item, column)}
                </TableCell>
              )
            })}
            {this.props.itemActions.length > 0 && (
              this.renderActions(item)
            )}
            </TableRow>
          )
        })}
      </TableBody>
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Table>
          { this.renderHead() }
          { this.renderBody() }
        </Table>

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

export default withStyles(styles)(ListViewTable)
