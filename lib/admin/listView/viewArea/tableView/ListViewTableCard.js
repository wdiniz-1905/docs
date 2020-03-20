import React from 'react'
import PropTypes from 'prop-types'
import { LTableCardView, LTitle } from 'lumen-web-sdk'

import { withStyles } from '@material-ui/core/styles'
import TablePagination from '@material-ui/core/TablePagination'

const styles = theme =>({
  root: {
    width: '100%',
    position: 'relative',
    minHeight: 200,
  },
  categorization: {
    marginBottom: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit,
    paddingBottom: 2 * theme.spacing.unit,
    borderBottom: `solid 2px ${theme.palette.grey[400]}`,
  },
})

class ListViewTableCard extends React.Component {
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
    showHeader: PropTypes.bool,
    hoverCard: PropTypes.bool,
    categorization: PropTypes.bool,
    categorizeBy: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.state = {
      cardOpen: '',
    }
  }

  handleCardClick = (item) => {
    let { cardOpen } = this.state

    cardOpen = item[this.props.identifierAttribute] === cardOpen ? '' : item[this.props.identifierAttribute]
    this.setState({ cardOpen })
  }

  renderCategorization () {
    const { classes, data, categorizeBy } = this.props

    const categorys = Array.from(new Set(data.map(item => item[categorizeBy])))


    return (
      categorys.map((category) => {
        return (
          <div>
            <LTitle level={1} weigth='super-thin'>
              { category }
            </LTitle>
            <div className={classes.categorization}>
              <LTableCardView
                showHeader={this.props.showHeader}
                hover={this.props.hoverCard}
                columns={this.props.columns}
                identifierAttribute={this.props.identifierAttribute}
                data={data.filter(item => item[categorizeBy] === category)}
                textOverflow='ellipsis'
                cardOpen={this.state.cardOpen}
                onClickCard={this.handleCardClick}
                itemActions={this.props.itemActions}
              />
            </div>
          </div>
        )
      })
    )
  }

  renderDefaultTableCard () {
    return (
      <LTableCardView
        showHeader={this.props.showHeader}
        hover={this.props.hoverCard}
        columns={this.props.columns}
        identifierAttribute={this.props.identifierAttribute}
        data={this.props.data}
        textOverflow='ellipsis'
        cardOpen={this.state.cardOpen}
        onClickCard={this.handleCardClick}
        itemActions={this.props.itemActions}
      />
    )
  }

  render () {
    const { classes, categorization } = this.props

    return (
      <div className={classes.root}>
        { (categorization && this.renderCategorization()) || this.renderDefaultTableCard() }

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


export default withStyles(styles)(ListViewTableCard)
