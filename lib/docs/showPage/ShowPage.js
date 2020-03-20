import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withLumen, LProgress, LDocsViewer } from 'lumen-web-sdk'
import { withAdmin } from '../../admin/AdminContext'
import { FileSearch } from 'mdi-material-ui'
import DocHeader from '../components/DocHeader'

const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
  viewer: {
    position: 'relative',
    height: 'calc(100% - 132px)',
  },
})

class ShowPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedDoc: {
        ext: null,
        path: null,
        label: null,
      },
    }
  }

  async componentDidMount () {
    this.setState({loading: true})
    await this.fetchDocument()
  }

  async fetchDocument () {
    const { body, response } = await this.props.lumen.client().data.docs
    .get(this.props.identifier)

    if (response.status === 200) {
      await this.setState({ 
        selectedDoc: {
          ext: body.data.ext,
          path: body.data.path,
          label: body.data.label,
        },
      })
    }

    this.setState({loading: false})
  }

  handleClickBack = () => {
    this.props.lumen.navigate(this.props.admin.baseUrl)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <DocHeader
          mainDescription={(this.state.selectedDoc && this.state.selectedDoc.label) || 'Documents'}
          onPreviousButtonClick={() => this.handleClickBack()}
        />
        {(this.state.loading && (
          <div className={classes.loading}>
            <LProgress
              icon={<FileSearch />}
              stage={'Looking for Document...'}
              barAnimation
            />
          </div>
        )) || (
          <div className={classes.viewer}>
            <LDocsViewer
              ext={this.state.selectedDoc.ext}
              path={this.state.selectedDoc.path}
              label={this.state.selectedDoc.label}
            />
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withLumen(withAdmin(ShowPage)))
