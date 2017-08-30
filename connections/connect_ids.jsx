import React from 'react'
import { connect } from 'react-redux'
import defaultFactories from './connect_ids_factories'

export function matchFactory(arg, factories, name) {
  for (let i=0; i<factories.length; i++) {
    const result = factories[i](arg)
    if (result !== undefined) return result
  }
  throw new Error(`invalid type of ${typeof arg} supplied for ${name}`)
}

/*
  connect a component to a single record from the api
  arguments:
    connectIds : [func(ids, props)] function that will return an object where items are mapped to props
               : [arrayOf(string)] maps each element to props with format: { elem1_ids: 'record ids with scope of elem1', ...}
               : [string] maps string to props with format: { string: 'record ids with scope of string' }
               : [undefined] maps props called ids: to the cords id object
*/

// @ArticlesCord.connectIds(['all', 'published'])

export default function connectIds(connectIds) {
  const initConnectIds = matchFactory(connectIds, defaultFactories, 'connectIds')
  console.log('connecting', connectIds)

  return (WrappedComponent) => {
    const mapStateToProps = (state, props) => {
      return {ids: initConnectIds(this.ids(state), props)}
    }

    const mapDisptachToProps = (dispatch, props) => {
      return {
        fetchIds: (ids) => dispatch(ids.fetch().bind(ids)),
        dispatch,
      }
    }

    @connect(mapStateToProps, mapDisptachToProps)
    class CordConnection extends React.Component {

      componentDidMount() {
        console.log('MOUNTED')
        Object.values(this.props.ids).forEach(id => {
          console.log(id, id.fetch())
          this.props.dispatch(id.fetch())
          // this.props.fetchIds(id)
        })
      }

      getWrappedProps() {
        const props = {...this.props}
      }

      render() {
        // console.log(this.props.ids.getIds())
        return <h1>Hi</h1>
        return <pre>{JSON.stringify({props: this.props, state: this.state}, null, '  ')}</pre>
        return <WrappedComponent {...this.getWrappedProps()} />

      }

    }

    return CordConnection

  }


}
