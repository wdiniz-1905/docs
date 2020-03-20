import React from 'react'

const AdminContext = React.createContext({})
const { Provider, Consumer } = AdminContext
const AdminContextProvider = Provider

const withAdmin = BaseComponent => {
  return class extends React.Component {
    static displayName = `withAdminContext(${BaseComponent.displayName})`

    render () {
      return (
        <Consumer>
          {context =>{
            return (
              <BaseComponent {...this.props} admin={context} />
            )
          }}
        </Consumer>
      )
      
    }
  }
}

export {
  AdminContextProvider,
  withAdmin,
}