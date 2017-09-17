import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'mobx-react'

import CordStore from './cord_store'

export default class CordProvider extends React.Component {

  static propTypes = {
    store: PropTypes.instanceOf(CordStore).isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, store } = this.props
    return (
      <Provider cordStore={store}>
        {React.Children.only(children)}
      </Provider>
    )
  }

}
