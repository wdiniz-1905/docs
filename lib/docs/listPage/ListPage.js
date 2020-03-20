import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withLumen, LTableCardView, LListView, LProgress } from 'lumen-web-sdk'
import { FileDocument, Folder, Delete, FilePdf, FileImage, Markdown, DeleteForever } from 'mdi-material-ui'
import moment from 'moment'
import i18next from 'i18next'

const translate = key => i18next.t(`docs:listView.${key}`, { returnObjects: true })

const EXT_IMG = ['jpeg', 'jfif', 'gif', 'bmp', 'png', 'psd', 'tiff', 'raw', 'webp', 'jpg', 'png', 'img']

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  loading:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
  listViewContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    paddingBottom: 80,
  },
  itemName: {
    verticalAlign: 'middle',
  },
  itemIcon: {
    verticalAlign: 'middle',
    marginRight: 2 * theme.spacing.unit,
    width: 24,
    height: 24,
  },
})

class ListPage extends React.Component {
  static propTypes = {
    selectedFolder: PropTypes.object,
    onClickItem: PropTypes.func,
    onDeleteItem: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      search:'',
      loading: false,
      selectedFolder: this.props.selectedFolder,
      listview: null,
    }
  }

  componentDidUpdate (e) {
    if(this.state.selectedFolder !== e.selectedFolder) {
      this.setState({selectedFolder: e.selectedFolder})
      this.listview.loadData()
    }

    if (e.componentUpdate) {
      this.listview.loadData()
    }
  }

  handleListViewItemClick = (item) => {
    this.props.onClickItem(item)
  }

  handleListViewItemDelete = async (item) => {
    this.setState({loading: true})
    if (item.type === 'Folder') {
      await this.props.lumen.client().data.docs.delete(encodeURIComponent(item.key))
      const childrens = await this.props.lumen.client().data.docs.list({ page:'', pageSize:'', orderBy:'', order:'', 'q[parentFolder]': item.key })
      await Promise.all(childrens.body.data.map(item => this.handleListViewItemDelete(item)))
    } else {
      await this.props.lumen.client().data.docs.delete(encodeURIComponent(item.key))
    }
  }

  confirmDeleteItem = async (item) => {
    if (window.confirm(translate('removeMenssageConfirm'))) { 
      await this.handleListViewItemDelete(item)
    }
  }

  handleListingParameters (page, pageSize, orderBy, order, search) { 
    let parentFolder = 'Documents'

    if ((this.props.selectedFolder !== null) && ( this.props.selectedFolder !== undefined)) {
      parentFolder = this.props.selectedFolder.key
    }

    return {
      page,
      pageSize,
      orderBy: 'type,desc;label',
      q: search,
      'q[parentFolder]': parentFolder,
    }
  }

  fetchListView = async (page, pageSize, orderBy, order, search) => {
    const response = await this.props.lumen.client().data.docs
      .list(this.handleListingParameters(page, pageSize, orderBy, order, search))
      return response.body
  }

  fetchData = async (page, pageSize, orderBy, order, search) => {
    const { classes } = this.props

    const response = await this.fetchListView(page, pageSize, orderBy, order, search)
    const { pagination } = response

    const data = response.data.map(item => {
      item.label = (
        <p className={classes.itemName}>
          {this.renderIcon(item)}
          { item.label }
        </p>
      )
      item.createdAt = this.dateFormat(item)
      return item
    })

    return { data, pagination }
  }

  dateFormat (item) {
    moment.locale(translate('dateLocale'))
    moment.updateLocale(translate('dateLocale'), {
      months : translate('months'),
    })
    const date = moment(new Date(item.createdAt)).format('DD [de] MMMM [de] YYYY')
    return date
  }

  renderIcon (item) {
    const { classes } = this.props
    let Icon = FileDocument

    if (EXT_IMG.includes(item.ext)) {
      Icon = FileImage
    }

    if (item.ext === 'pdf') {
      Icon = FilePdf
    }

    if (item.ext === 'md') {
      Icon = Markdown
    }

    if (item.type === 'Folder') {
      Icon = Folder
    }

    return <Icon className={classes.itemIcon} />
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        {(this.state.loading && (
          <div className={classes.loading}>
            <LProgress
              icon={<DeleteForever />}
              stage={'Deleting ...'}
              barAnimation
            />
          </div>
        )) || (
          <div className={classes.root}>
            <div className={classes.listViewContainer}>
              <LListView
                lisviewRef={listview => { this.listview = listview }}
                variant='compact'
                searchPlaceholder='Search'// added translate
                fetchData={this.fetchData}
                visualisations={[
                  {
                    type: 'listCard',
                    renderer: data => {
                      return (
                        <LTableCardView
                          showHeader
                          hover
                          columns={[
                            { id: 'label', label: translate('name') },
                          ]}
                          identifierAttribute='key'
                          data={data}
                          textOverflow='ellipsis'
                          onClickCard={this.handleListViewItemClick}
                          itemActions={[
                            // {
                            //   label: translate('edit'),
                            //   icon: <Pencil />,
                            //   action: () => console.log(`Edit this row.`),
                            // },
                            {
                              label: translate('remove'),
                              icon: <Delete />,
                              action: async (e) => {
                                await this.confirmDeleteItem(e)
                                await this.listview.loadData()
                                this.setState({loading: false})
                                this.props.onDeleteItem(e)
                              },
                            },
                          ]}
                        />
                      )
                    },
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withLumen(ListPage))
