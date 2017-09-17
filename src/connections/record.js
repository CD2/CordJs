import React from 'react'
import { inject, observer } from 'mobx-react'

import match from './match'
import { idFactories, attributesFactories } from './record_factories'

export default function({
  id=this.defaultPropName,
  as=this.defaultAs,
  attributes=[],
  reloadAs='reload'
}={}) {

  const cord = this
  const getId = match(id, idFactories, 'connectRecordIds')
  const getAttributes = match(attributes, attributesFactories, 'connectRecordAttributes')

  return (Component) => {

    @inject("cordStore")
    @observer
    class ConnectedIds extends React.Component {

      componentDidMount() {
        this.fetch()
      }

      componentWillReceiveProps(props) {
        this.fetch(props)
      }

      fetch = (props=this.props, { reload=false }={}) => {
        const id = getId(props)
        const attributes = getAttributes(props)
        if (Array.isArray(id)) {
          id.map(id => this.props.cordStore.fetchRecord(cord, id, attributes, { reload }))
        } else {
          this.props.cordStore.fetchRecord(cord, id, attributes, { reload })
        }
      }

      reload = () => {
        this.fetch({reload: true})
      }

      render() {
        const id = getId(this.props)
        const attributes = getAttributes(this.props)

        console.log({as, id, attributes, record: this.props.cordStore.getRecord(cord, id)})
        if (Array.isArray(id)) {
          let loaded = true
          let records = []
          id.forEach(id => {
            if (!loaded || !this.props.cordStore.isRecordLoaded(cord, id, attributes)) return loaded = false
            records.push(this.props.cordStore.getRecord(cord, id))

          })

          const props = {...this.props}
          delete props.cordStore
          props[as] = records
          props[reloadAs] = this.reload

          return (
            <Component {...props} />
          )
        } else {
          if (!this.props.cordStore.isRecordLoaded(cord, id, attributes)) return <b>LOADING</b>
          const record = this.props.cordStore.getRecord(cord, id)

          const props = {...this.props}
          delete props.cordStore
          props[as] = record
          props[reloadAs] = this.reload

          return (
            <Component {...props} />
          )
        }

      }
    }
    return ConnectedIds
  }
}
