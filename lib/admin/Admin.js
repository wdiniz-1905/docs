import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import { AdminContextProvider } from './AdminContext'

class Admin extends React.Component {
  static propTypes = {
    listViewRenderer: PropTypes.func,
    createViewRenderer: PropTypes.func,
    showViewRenderer: PropTypes.func,
    editViewRenderer: PropTypes.func,
    baseUrl: PropTypes.string.isRequired,
  }

  get adminContext () {
    return {
      baseUrl: this.props.baseUrl,
    }
  }

  renderListView () {
    return this.props.listViewRenderer() || (
      <p>default list view</p>
    )
  }

  renderCreateView () {
    return this.props.createViewRenderer() || (
      <p>default create view</p>
    )
  }

  renderShowView (identifier) {
    // console.log('id', identifier)
    return this.props.showViewRenderer(identifier) || (
      <p>default show view</p>
    )
  }

  renderEditView (identifier) {
    return this.props.editViewRenderer(identifier) || (
      <p>default edit view</p>
    )
  }

  render () {
    return (
      <AdminContextProvider value={this.adminContext}>
        <Switch>
          <Route
            exact
            path={this.props.baseUrl}
            render={() => {
              return this.renderListView()
            }}
          />

          <Route
            exact
            path={`${this.props.baseUrl}/new`}
            render={() => {
              return this.renderCreateView()
            }}
          />

          <Route
            exact
            path={`${this.props.baseUrl}/:identifier`}
            render={({ match }) => {
              const { identifier } = match.params

              return this.renderShowView(identifier)
            }}
          />

          <Route
            exact
            path={`${this.props.baseUrl}/:identifier/edit`}
            render={({ match }) => {
              const { identifier } = match.params

              return this.renderEditView(identifier)
            }}
          />
        </Switch>
      </AdminContextProvider>
    )
  }
}

export default Admin




