import React from 'react'
import { inject, observer } from 'mobx-react'

import match from './match'

export default function({as='fetchIds'} = {}) {
  const cord = this
  return (Component) => {

    @inject("cordStore")
    @observer
    class ConnectedIdFetcher extends React.Component {

      fetcher = (scope, opts) => {
        return this.props.cordStore.fetchIdsReturnPromise(cord, {scope, ...opts})
                    .then(data => data[cord.table_name].ids)
      }

      render() {
        const props = {...this.props}
        delete props.cordStore
        return (
          <Component {...props} {...{[as]: this.fetcher}} />
        )
      }
    }

    return ConnectedIdFetcher
  }
}
