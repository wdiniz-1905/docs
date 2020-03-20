import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { withLumen, LButton, LFileUpload, LTextField, LMarkdownEditor, LProgress, LTag } from 'lumen-web-sdk'
import { FileUpload, FileCheck } from 'mdi-material-ui'
import DocHeader from '../components/DocHeader'
import FieldTextArea from '../components/FieldTextArea'
import i18n from './../../../../i18n'

const translate = key => i18n.t(`docs:newDocs.${key}`)

const styles = theme => ({

  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 75,
  },
  loading:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
  containerButtonsTop: {
    height: 75,
    width: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerButtonsBotton: {
    height: 75,
    width: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerBody: {
    width: 764,
    marginBottom: 30,
  },
  body: {
    height: 300,
    marginBottom: 30,
  },
  textField: {
    marginBottom: 30,
  },
  fileReady: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'green',
    borderRadius: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    height: '100%',
    padding: 16,
  },
  text: {
    textAlign: 'center',
    color: 'green',
    fontSize: theme.typography.pxToRem(36),
    marginBottom: 20,
  },
  tags: {
    marginBottom: 30,
  },
})

class NewDocs extends React.Component {
  static propTypes = {
    selectedFolder: PropTypes.object,
    onClickBack: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      descriptionText: '',
      markdownText: '',
      docName: '',
      docExt: '',
      path: '',
      tags: [],
      file: null,
      markdown: true,
      uploadFile: false,
    }
  }

  handleCancel = () => {
    this.setState({
      descriptionText: '',
      markdownText: '',
      docName: '',
      docExt: '',
    })
  }

  handleClickMarkdown = () => {
    this.handleCancel()
    this.setState({
      markdown: true,
      uploadFile: false,
    })
  }

  handleClickFile = () => {
    this.handleCancel()
    this.setState({
      markdown: false,
      uploadFile: true,
    })
  }

  handleClickCreateFile = async () => {
    let error = false

    if (!this.state.docName) {
      error= translate('errorMessageFileName')
    }

    if (this.state.markdown) {
      const file = await new File([this.state.markdownText], this.state.docName, {type: "text/plain;charset=utf-8"})
      this.setState({
        file: file,
        docExt: 'md',
      })  
    }

    if (!this.state.file) {
      error= translate('errorMessageFileNotFound')
    }

    let verifyBar = this.state.docName.split('/')

    if ((verifyBar.length > 1)) {
      error = translate('errorMessageCaracterInvalid')
    }

    if (!error) {
      this.setState({loading: true})
      const fileDocsExist = await this.props.lumen.client().data.docs
      .get(encodeURIComponent(`${this.props.selectedFolder.key}/${this.state.docName}.${this.state.docExt}`))

      if(fileDocsExist.response.status === 200) {
        error = translate('errorMessageFileExist')
      }
    }

    if (!error) {
      const identifier = encodeURIComponent(`${this.props.selectedFolder.key.split('/').join('-')}-${this.state.docName}.${this.state.docExt}`)
      const fileSaveResponse = await this.props.lumen.client().file
        .save('lumen-docs', identifier, this.state.file)

      if (fileSaveResponse.response.ok && fileSaveResponse.body.success) {
        const filePath = await this.props.lumen.client().file
          .getFilePath('lumen-docs', identifier)

        let fileMetadata = ''
        try {
          const metadataResponse = await this.props.lumen.client().file
            .metadata('lumen-docs', identifier)

          fileMetadata = metadataResponse.body.metadata
        } catch (error) {
          console.log('RESPONSE FAIL METADADA:', error)
        }

        const fileDocsRegister = await this.props.lumen.client()
          .data.docs.create({
            key: `${this.props.selectedFolder.key}/${this.state.docName}.${this.state.docExt}`,
            label: this.state.docName,
            type: 'Doc',
            ext: this.state.docExt,
            parentFolder: this.props.selectedFolder.key,
            description: this.state.descriptionText,
            path: filePath,
            metadata: fileMetadata,
            tags: this.state.tags,
          })

        if (fileDocsRegister.response.ok && fileDocsRegister.body.success) {
          this.setState({loading: false})
          this.props.onClickBack()
        } else {
          this.setState({loading: false})
          error = fileDocsRegister.body.message
        }
      } else {
        this.setState({loading: false})
        error = fileSaveResponse.body.message
      }
    }
    
    if (error) {
      this.setState({loading: false})
      alert(error) // eslint-disable-line
    }
  }

  handleDropFile = (file) => {
    if (!file.length) return
    this.setState({
      file: file[0],
      docName: file[0].name.split('.')[0],
      docExt: file[0].name.split('.')[1],
    })
  }

  handleAddTag = (newTag) => {
    this.setState({ tags: [...this.state.tags, newTag] })
  }

  handleRemoveTag = (tagKey) => {
    this.setState({ tags: this.state.tags.filter(tag => tag.key !== tagKey) })
  }

  renderMarkdown = () => {
    const { classes } = this.props
    return (
      <div className={classes.body}>
        <LMarkdownEditor
          value={this.state.markdownText}
          size='default'
          onChange={(e) => this.setState({ markdownText: e })}
        />
      </div>
    )
  }

  renderUploadFile = () => {
    const { classes } = this.props
    return (
      <div className={classes.body}>
        <LFileUpload
          icon={<FileUpload />}
          height={300}
          hint= {translate('uploadFileDescription')}
          onDrop={this.handleDropFile}
        />
      </div>
    )
  }

  renderUploadReady = () => {
    const { classes } = this.props
    return (
      <div className={classes.body}>
        <div className={classes.fileReady}>
          <div className={classes.text}>
            <FileCheck fontSize='large'/>
          </div>
          <div className={classes.text}>
            {`${this.state.docName}.${this.state.docExt}`}
          </div>
          <LButton
            label= {translate('cancel')}
            kind='inverted'
            onClick={this.handleCancel}
          />
        </div>
      </div>
    )
  }

  renderTagCreation () {
    return (
      <LTag
        tags={this.state.tags}
        onAddTag={this.handleAddTag}
        onRemoveTag={this.handleRemoveTag}
      />
    )
  }

  render () {
    const { classes } = this.props

    return (
      <div>
        {(this.state.loading && (
          <div className={classes.loading}>
            <LProgress
              icon={<FileUpload />}
              stage={'Uploading document...'}
              barAnimation
            />
          </div>
        )) || (
          <div className={classes.root}>
            <DocHeader
              mainDescription= {translate('createNewDocument')}
              onPreviousButtonClick={this.props.onClickBack}
            />
            <div className={classes.containerButtonsTop}>
              <LButton
                label= {translate('markdown')}
                shape='square'
                kind={this.state.markdown ? 'secondary' : 'inverted'}
                onClick={this.handleClickMarkdown}
              />
              <LButton
                label= {translate('uploadFile')}
                shape='square'
                kind={this.state.uploadFile ? 'secondary' : 'inverted'}
                onClick={this.handleClickFile}
              />
            </div>
            <div className={classes.containerBody}>
              {this.state.markdown && this.renderMarkdown()}
              {this.state.uploadFile && ((this.state.docName && this.state.file && this.renderUploadReady()) || this.renderUploadFile())}
              <div className={classes.textField}>
                <LTextField
                  label= {translate('documentName')}
                  value={this.state.docName}
                  placeholder= {translate('name')}
                  onChange={e => this.setState({ docName: e.currentTarget.value })}
                  shrink
                />
              </div>

              <div className={classes.tags}>
                { this.renderTagCreation() }
              </div>

              <FieldTextArea
                id='description-file'
                label= {translate('description')}
                value={this.state.descriptionText}
                onChange={e => this.setState({ descriptionText: e.currentTarget.value })}
              />
            </div>
            <div className={classes.containerButtonsBotton}>
              <LButton
                label= {translate('cancel')}
                kind='inverted'
                onClick={this.props.onClickBack}
              />
              <LButton
                label= {translate('create')}
                kind='secondary'
                onClick={this.handleClickCreateFile}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withLumen(NewDocs))
