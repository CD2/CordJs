// Connections

export default {
  connectIds: require('./connect_ids.jsx').default,
  connectRecords: require('./connect_records').default,
  connectActions: require('./connect_actions').default,
}

//
// // IDS
// import defaultConnectIdsFactories from './connectIdsFactories'
//
// // generate prop name from scope name
// // @Articles.connect_ids(...scopes) #=> {article_ids: ALL, scope_ids: [1,2,3], scope2: [3,4,5]}
// export const connectIds = (connectIds) => {
//   const connectIdsCallback = matchFactory(connectIds, defaultConnectIdsFactories, 'connectIds')
//   return cordHOC()
// }
//
//
// /*
//
// @Articles.connectIds(['popular'])
// class Thing extends Components {
//
//   popular_ids
//
// }
//
// */
//
//
// class CordConnection extends React.Component {
//
//   static propTypes = {
//     cord: PropTypes.instanceOf(Cord),
//     cordOptions: PropTypes.object.isRequired,
//     cord
//   }
//
//
// }
//
//
