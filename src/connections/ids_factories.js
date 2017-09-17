/*
  given an argument the factory must return a
  function which takes props and outputs an object with the shape:
  {
    prop_name_to_map_to: {scope: 'scope_name', [additional_query_data]}
  }
*/

/*
  connectIds({
    prop_name: 'scope_name',
  })
*/
const whenConnectIdsIsObject = (connectIds) => {
  return (typeof connectIds === 'object')
    ? () => connectIds
    : undefined
}

/*
  connectIds(props => {
    return {
      prop_name: 'scope_name'
    }
  })
*/
const whenConnectIdsIsFunction = (connectIds) =>
  (typeof connectIds === 'function')
  ? (props) => connectIds.call(null, props)
  : undefined


const whenConnectIdsIsString = (connectIds) =>
  (typeof connectIds === 'string')
  ? (props) => ({[`${connectIds}_ids`]: {scope: connectIds}})
  : undefined

// @connectIds(['scope1', 'scope2', 'scope3'])
const whenConnectIdsIsArray = (connectIds) =>
  (Array.isArray(connectIds))
  ? (props) => connectIds.reduce((collected, scope) => {
    collected[`${scope}_ids`] = { scope }
    return collected
  }, {})
  : undefined

const whenConnectIdsIsUndefined = (connectIds) =>
  (connectIds === undefined)
  ? () => ({all_ids: {scope: 'all'}})
  : undefined

export default [
  whenConnectIdsIsFunction,
  whenConnectIdsIsString,
  whenConnectIdsIsArray,
  whenConnectIdsIsUndefined,
  whenConnectIdsIsObject,
]
