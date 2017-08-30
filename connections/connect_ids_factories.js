
const whenConnectIdsIsFunction = (connectIds) => {
  return (typeof connectIds === 'function')
  ? (ids, props) => connectIds.call(null, ids, props)
  : undefined
}

const whenConnectIdsIsString = (connectIds) => {
  return (typeof connectIds === 'string')
  ? (ids) => ({ [`${connectIds}_ids`]: ids.get(connectIds) })
  : undefined
}

const whenConnectIdsIsArray = (connectIds) => {
  return (Array.isArray(connectIds))
  ? (ids) => connectIds.reduce((ids, scope) => ids[`${scope}_ids`] = ids.get(scope))
  : undefined
}

export default [
  whenConnectIdsIsFunction,
  whenConnectIdsIsString,
  whenConnectIdsIsArray,
]
