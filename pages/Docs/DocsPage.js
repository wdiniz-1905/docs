import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Admin, withLumen, Page,LTreeView, LTitle, LButton, LIconButton, LModal, LTextField } from 'lumen-web-sdk'
import { Plus, Folder, FolderPlus } from 'mdi-material-ui'
import ListPage from '../../lib/docs/listPage/ListPage'
import ShowPage from '../../lib/docs/showPage/ShowPage'
import NewDocs from '../../lib/docs/newDocs/NewDocs'

import DataHelper from '../../lib/docs/helper/DataHelper'
import FieldTextArea from '../../lib/docs/components/FieldTextArea'
import i18n from './../../../i18n'

const translate = key => i18n.t(`docs:docsPage.${key}`)

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height:'100%',
  },
  container: {
    display: 'flex',
    height: '100%',
  },
  sideBarContainer: {
    padding: 16,
    minWidth: 240,
    backgroundColor: '#fff',
  },
  listViewContainer: {
    position: 'relative',
    overflow: 'auto',
    width: '100%',
    height: '100%',
  },
  showViewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  modalBody: {
    height: 290,
    width: 460,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  containerLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: theme.palette.secondary.main,
  },
  containerButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 245,
    alignItems: 'center',
  },
})

class DocsPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      tree: [],
      selectedFolder: null,
      folderName:'',
      descriptionText:'',
      componentUpdate: false,
    }
  }

  breadcrumbs = [
    { label: 'Lumen Platform', path: '/' },
    { label: translate('documents') },
  ]

  async componentDidMount () {
    await this.fetchTree()
  }

  handleOpenModal = () => {
    this.setState({ open: true })
  }

  handleCloseModal = () => {
    this.setState({ 
      open: false,
      folderName: '',
      descriptionText: '',
      componentUpdate: false,
    })
  }

  handleDeleteItem = async () => {
    await this.fetchTree()
  }

  handleItemClick = (item) => {
    if (item.type === 'Folder') {
      this.setState({
        selectedFolder: item,
      })
      this.handleClickBack()
    }

    if (item.type === 'Doc') {
      this.props.lumen.navigate(`/documents/${encodeURIComponent(item.key)}`)
    }
  }

  handleItemSelect = (item) => {
      this.setState({
        selectedFolder: item,
      })
  }

  fetchDataTree = async (page, pageSize, orderBy, order, search) => {
    const response = await this.props.lumen.client().data.docs
      .list({ page, pageSize, orderBy, order, 'q[type]': 'Folder' })
    return response
  }

  fecthDataLoop = async (page, pageSize, orderBy, order, search) => {
    const response = await this.fetchDataTree(page, pageSize, orderBy, order, search)
    let { totalItems, currentPage } = response.body.pagination
    const { data } = response.body

    while (totalItems > data.length) {
      const page = currentPage + 1
      const loopResponse = await this.fetchDataTree(page, pageSize, orderBy, order, search)
      const loopData = loopResponse.body.data
      loopData.map(item => data.push(item))
    }
    return data
  }

  fetchTree = async () => {
    const data = await this.fecthDataLoop()
    const tree = new DataHelper(data).mountData()
    this.setState({ 
      tree, 
      selectedFolder: this.state.selectedFolder || tree[0],
    })
  }

  handleClickBack = () => {
    this.props.lumen.navigate(`/documents`)
  }

  handleClickShowNewDocs = () => {
    this.props.lumen.navigate(`/documents/new`)
  }

  handleClickCreateFolder = async () => {
    let error = false

    if (!this.state.folderName) {
      error = translate('errorMessageFolderName')
    }

    let verifyBar = this.state.folderName.split('/')

    if (verifyBar.length > 1) {
      error = translate('errorMessageCaracterInvalid')
    }

    if (!error) {
      const fileDocsExist = await this.props.lumen.client().data.docs
      .get(encodeURIComponent(`${this.state.selectedFolder.key}/${this.state.folderName}`))

      if(fileDocsExist.response.status === 200) {
        error = translate('errorMessageFolderExist')
      }
    }
    
    if (!error) {
      const fileDocsRegister = await this.props.lumen.client()
      .data.docs.create({
        key: `${this.state.selectedFolder.key}/${this.state.folderName}`,
        label: this.state.folderName,
        type: 'Folder',
        parentFolder: this.state.selectedFolder.key,
        description: this.state.descriptionText,
      })

      if (fileDocsRegister.response.ok && fileDocsRegister.body.success) {
        this.fetchTree()
        this.setState({componentUpdate : true})
        this.handleCloseModal()
      } else {
        error = fileDocsRegister.body.message
      }
    }

    if (error) {
      alert(error) // eslint-disable-line
    }
  }

  renderHeader () {
    const { classes } = this.props
    return (
      <div className={classes.containerLabel}>
        <LTitle level={4} weight='thin' color='secondary-contrast'>
          {(this.state.selectedFolder && this.state.selectedFolder.key)}
        </LTitle>
        <div className={classes.containerButtons}>
          <LButton
            label={translate('document')}
            kind='inverted'
            icon={<Plus />}
            onClick={() => this.handleClickShowNewDocs()}
          />
          <LIconButton
            icon={<FolderPlus />}
            size='large'
            color='white'
            kind='circle'
            onClick={this.handleOpenModal}
          />
        </div>
      </div>
    )
  }

  renderTreeView () {
    const { classes } = this.props
    return (
      <div className={classes.sideBarContainer}>
        <LTreeView
          initializeExpanded={true}
          getIcon={item => <Folder />}
          getLabel={item => item.label}
          selectedItemKey={(this.state.selectedFolder && this.state.selectedFolder.key) || 'Documents'}
          onItemClick={this.handleItemClick}
          onItemSelect={this.handleItemSelect}
          data={this.state.tree}
        />
      </div>
    )
  }

  createViewRenderer = (identifier) => {
    const { classes } = this.props
    return (
      <div className={classes.listViewContainer}>
        <NewDocs
          identifier={identifier}
          selectedFolder={this.state.selectedFolder}
          onClickBack={() => this.handleClickBack()}
        />
      </div>
    )
  }

  listViewRenderer = () => {
    const { classes } = this.props
    return (
      <div className={classes.listViewContainer}>
        <ListPage
          componentUpdate={this.state.componentUpdate}
          selectedFolder={this.state.selectedFolder}
          onClickItem={(item) => this.handleItemClick(item)}
          onDeleteItem={this.handleDeleteItem}
        />
      </div>
    )
  }

  showViewRenderer = (identifier) => {
    const { classes } = this.props
    return (
      <div className={classes.showViewContainer}>
        <ShowPage
          identifier={identifier}
        />
      </div>
    )
  }

  render () {
    const { classes } = this.props
    return (
      <Page
        title={translate('lumenDocuments')}
        breadcrumbs={this.breadcrumbs}
      >
        {this.renderHeader()}
        <div className={classes.root}>
          <LModal
            label={translate('newFolder')}
            size='small'
            open={this.state.open}
            onClose={this.handleCloseModal}
            buttons={[
              <LButton 
                onClick={this.handleClickCreateFolder} 
                label={translate('create')}
                kind='primary' 
                size='default' 
              />,
            ]}
          >
            <div className={classes.modalBody}>
              <div>
                <LTextField
                  label={translate('folderName')}
                  value={this.state.folderName}
                  placeholder={translate('name')}
                  onChange={e => this.setState({ folderName: e.currentTarget.value })}
                  shrink
                />
              </div>
              <div>
                <FieldTextArea
                  id='description-file'
                  label={translate('description')}
                  value={this.state.descriptionText}
                  onChange={e => this.setState({ descriptionText: e.currentTarget.value })}
                />
              </div>
            </div>  
          </LModal>
          
          <div className={classes.container}>
            {this.renderTreeView()}
            <Admin
              baseUrl='/documents'
              listViewRenderer={this.listViewRenderer}
              createViewRenderer={this.createViewRenderer}
              showViewRenderer={this.showViewRenderer}
            />
          </div>
        </div>
      </Page>
    )
  }
}

export default withStyles(styles)(withLumen(DocsPage))
