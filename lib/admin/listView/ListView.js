import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withAdmin } from '../AdminContext'

import ListViewSearch from './ListViewSearch'
import ListViewCreateNew from './ListViewCreateNew'
import ListViewToggle from './ListViewToggle'
import ListViewFooter from './ListViewFooter'
import ListViewTable from './viewArea/tableView/ListViewTable'
import ListViewGrid from './viewArea/gridView/ListViewGrid'
import ListViewTableCartd from './viewArea/tableView/ListViewTableCard'

import { Pencil, CubeOutline, Delete } from 'mdi-material-ui'

import { withLumen, LProgress, LPageHeader, LButton } from 'lumen-web-sdk'
import i18n from './../../../../i18n'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 6 * theme.spacing.unit,
    overflow: 'scroll',

  },
  roorSimple: {
    backgroundColor: '#fff',
    overflow: 'scroll',
    
  },
  rootCompact: {
    backgroundColor: '#efefef',
    width: '100%',
    minHeight: '100%',
    overflow: 'scroll',
  },
  rootFull: {
    backgroundColor: '#efefef',
    width: '100%',
    minHeight: '100%',
  },
  headerContainer: {
    width: '100%',
    maxWidth: 1024,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 1024,
    paddingLeft: 2 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
  },
  title: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 500,
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 1 * theme.spacing.unit,
  },
  bigHeaderControlsRow: {
    width: '100%',
    maxWidth: 1024,
    marginTop: 6 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
  },
  iconSize: {
    width: 75,
    height: 75,
  },
})

const translate = key => i18n.t(`common:listView.${key}`)

class ListView extends React.Component {
  static propTypes = {
    fetchData: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    gridFields: PropTypes.object,
    gridSize: PropTypes.oneOf(['default', 'small', 'thin']),
    itemActions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
    title: PropTypes.string,
    subTitle: PropTypes.string,
    createNewLabel: PropTypes.string,
    createNewIcon: PropTypes.element,
    searchPlaceholder: PropTypes.string,
    identifierAttribute: PropTypes.string,
    variant: PropTypes.oneOf(['simple', 'compact', 'full']),
    itemActionOnClick: PropTypes.oneOf(['route', 'select']),
    itemsSelected: PropTypes.array,
    handleItemOnClick: PropTypes.func,
    defaultVisualization: PropTypes.oneOf(['grid', 'list', 'listCard']),
    allowedVisualizations: PropTypes.arrayOf(PropTypes.oneOf(['grid', 'list', 'listCard'])),
    checkboxColumn: PropTypes.bool,
    confirmButton: PropTypes.object,
    cancelButton: PropTypes.object,
    showHeader: PropTypes.bool,
    hoverCard: PropTypes.bool,
    headerButton: PropTypes.bool,
    gridType: PropTypes.string,
    headerBackgroundImage: PropTypes.string,
    categorization: PropTypes.bool,
    categorizeBy: PropTypes.string,
    onItemRemove: this.handleItemRemove,
  }

  static defaultProps = {
    variant: 'simple',
    allowedVisualizations: ['grid', 'list', 'listCard'],
    gridFields: {
      title: 'title',
      subtitle: 'subtitle',
      image: 'image',
      categorization: false,
    },
    headerBackgroundImage: null,
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      orderBy: '',
      order: 'asc',
      page: 1,
      pageSize: 10,
      search: '',
      data: [],
      visualizationType: props.defaultVisualization || this.props.allowedVisualizations[0],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0,
      },
    }

    if (this.props.lisviewRef) {
      this.props.lisviewRef(this)
    }
  }

  componentDidMount () {
    this.loadData()
  }

  async loadData () {
    this.setState({ loading: true })
    
    const { data, pagination } = await this.props.fetchData(
      this.state.page, 
      this.state.pageSize, 
      this.state.orderBy, 
      this.state.order, 
      this.state.search
      )
      
    this.setState({ data, pagination, loading: false })
  }

  get identifierAttribute() {
    return this.props.identifierAttribute || 'id'
  }

  handleItemEdit = (item) => {
    const identifier = item[this.identifierAttribute]

    const editUrl = `${this.props.admin.baseUrl}/${identifier}/edit`

    this.props.lumen.navigate(editUrl)
  }

  handleItemRemove = (item) => {
    if (this.props.onItemRemove && this.props.onItemRemove(item)) {
      this.handleRefresh()

      this.props.lumen.toast.success('Project deleted successfully')
    } else {
      this.props.lumen.toast.minor('Could not delete project')
    }
  }

  handleItemClick = (item) => {
    if (this.props.itemActionOnClick === 'route') {
      const identifier = item[this.identifierAttribute]
      const itemViewUrl = `${this.props.admin.baseUrl}/${identifier}`

    this.props.lumen.navigate(itemViewUrl)
    }

    if (this.props.itemActionOnClick === 'select') {
      this.props.handleItemOnClick(item)
    }
  }

  handleCreateNewClick = () => {
    const newUrl = `${this.props.admin.baseUrl}/new`
    this.props.lumen.navigate(newUrl)
  }

  handleConfirmClick = () => {
    this.props.confirmButton.onClick(this.state.data)
  }

  handleCancelClick = () => {
    this.props.cancelButton.onClick()
  }

  handleSearch = (search) => {
    this.setState({
      search,
    }, this.loadData)
  }

  handleSortColumn = (columnId) => {
    let { orderBy, order } = this.state

    if (orderBy === columnId) { // invert order
      order = (order === 'asc') ? 'desc' : 'asc'
    }

    orderBy = columnId

    this.setState({
      orderBy,
      order,
    }, this.loadData)
  }

  handleChangePage = (e, page) => {
    this.setState({
      page: page + 1,
    }, this.loadData)
  }

  handleChangeRowsPerPage = (event) => {
    const pageSize = event.target.value

    this.setState({
      pageSize,
    }, this.loadData)
  }

  handleChangeVisualizationType = (visualizationType) => {
    this.setState({ visualizationType })
  }

  handleRefresh = () => {
    this.loadData()
  }

  get itemActions () {
    if (this.props.itemActions === undefined) {
      return []
    }
    const defaultActions = {
      edit: {label: 'Edit', icon: <Pencil />, action: this.handleItemEdit},
      remove: {label: 'Remove', icon: <Delete />, action: this.handleItemRemove},
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

  renderHeader () {
    if (this.props.variant === 'full') {
      return this.renderBigHeader()
    }

    if (this.props.variant === 'compact') {
      return this.renderCompactHeader()
    }

    return this.renderDefaultHeader()
  }

  renderBigHeader () {
    const { classes } = this.props

    return [
      <LPageHeader
        title={this.props.title}
        subtitle={this.props.subTitle}
        buttons={
          this.props.headerButton && [
          <LButton
            key='add-new'
            label={this.props.createNewLabel}
            icon={this.props.createNewIcon}
            kind='primary'
            size='large'
            onClick={this.handleCreateNewClick}/>,
        ]}
        backgroundImage={this.props.headerBackgroundImage}
        disableBackgroundFade
        disableBackgroundBlur
      />,
      <div key='controls' className={classNames(classes.controlsRow, classes.bigHeaderControlsRow)}>
        <ListViewSearch
          placeholder={this.props.searchPlaceholder}
          onSearch={this.handleSearch}
        />

        { this.props.allowedVisualizations.length > 1 &&
          <ListViewToggle
            visualizationType={this.state.visualizationType}
            allowedVisualizations={this.props.allowedVisualizations}
            refreshButton={this.props.refreshButton}
            onChange={this.handleChangeVisualizationType}
            onRefreshClick={this.handleRefresh}
          />
        }
        
      </div>,
    ]
  }
  
  renderCompactHeader () {
    const { classes } = this.props

    return (
      <div key='controls' className={classNames(classes.controlsRow, classes.bigHeaderControlsRow)}>
        <ListViewSearch
          placeholder={this.props.searchPlaceholder}
          onSearch={this.handleSearch}
        />

        { this.props.allowedVisualizations.length > 1 &&
          <ListViewToggle
            visualizationType={this.state.visualizationType}
            allowedVisualizations={this.props.allowedVisualizations}
            refreshButton={this.props.refreshButton}
            onChange={this.handleChangeVisualizationType}
            onRefreshClick={this.handleRefresh}
          />
        }
        
      </div>
    )
  }

  renderDefaultHeader () {
    const { classes } = this.props

    return (
      <div className={classes.headerContainer}>
        <h2 className={classes.title}>{this.props.title}</h2>

        <div className={classes.controlsRow}>
          <ListViewSearch
            placeholder={"this.props.searchPlaceholder"}
            onSearch={this.handleSearch}
          />
          <ListViewCreateNew
            label={this.props.createNewLabel}
            icon={this.props.createNewIcon}
            onClick={this.handleCreateNewClick}
          />
        </div>
      </div>
    )
  }

  renderGridOrList () {
    const Component = {
      'grid': ListViewGrid,
      'list': ListViewTable,
      'listCard': ListViewTableCartd,
    }[this.state.visualizationType]
    
    return (
      <Component
        listView={this}
        loading={this.state.loading}
        columns={this.props.columns}
        gridFields={this.props.gridFields}
        gridSize={this.props.gridSize}
        orderBy={this.state.orderBy}
        order={this.state.order}
        data={this.state.data}
        itemsSelected={this.props.itemsSelected}
        identifierAttribute={this.identifierAttribute}
        pagination={this.state.pagination}
        itemActions={this.itemActions}
        onItemEdit={this.handleItemEdit}
        onItemClick={this.handleItemClick}
        onClickSort={this.handleSortColumn}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
        checkboxColumn={this.props.checkboxColumn}
        showHeader={this.props.showHeader}
        hoverCard={this.props.hoverCard}
        gridItemType={this.props.gridItemType}
        itemActionOnClick={this.props.itemActionOnClick}
        categorization={this.props.categorization}
        categorizeBy={this.props.categorizeBy}
      />
    )
  }

  get zeroResults () {
    return !this.state.loading && (this.state.data === undefined || this.state.data.length === 0)
  }

  renderWelcomeScreen () {
    return (
      this.props.zeroResultMessage(this.state.search)
    )
  }
  renderListContent () {
    const { classes } = this.props

    if (this.zeroResults && this.props.zeroResultMessage) {
      return this.renderWelcomeScreen()
    }

    return (
      <div className={classes.contentContainer}>
        { this.renderGridOrList() }
      </div>
    )
  }

  renderCancelConfirmButtons () {
    if (this.props.confirmButton !== undefined || this.props.cancelButton !== undefined) {
      return (
        <ListViewFooter
          confirmButton={this.props.confirmButton}
          onConfirmClick={this.handleConfirmClick}
          cancelButton={this.props.cancelButton}
          onCancelClick={this.handleCancelClick}
          counter={this.props.itemsSelected.length}
        />
      )
    }
  }

  render () {
    const { classes } = this.props

    return (
      <div className={classNames(
        classes.root,
        (this.props.variant === 'full' && classes.rootFull),
        (this.props.variant === 'simple' && classes.rootSimple),
        (this.props.variant === 'compact' && classes.rootCompact))
      }>
      
        { this.renderHeader() }
        {(this.state.loading && (
          <LProgress
            icon={<CubeOutline />}
            value={47}
            stage={`${translate('loadingData')}...`}
          />
        )) || [
          this.renderListContent(),
          this.renderCancelConfirmButtons(),
        ]}
      </div>
    )
  }
}

export default withStyles(styles)(withLumen(withAdmin(ListView)))
