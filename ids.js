
export default class CordIds {

  static REDUCER_KEY = 'ids'

  scopes = []
  method = null

  constructor(cord, state) {
    this.cord = cord
    this.state = state
  }

  get(scope, params={}) {
    const ids = this.dup()
    ids.scopes = [scope]
    ids.method = 'or'
    return ids
  }

  or(...scopes) {
    const ids = this.dup()
    ids.scopes = scopes
    ids.method = 'or'
    return ids
  }

  and(...scopes) {
    const ids = this.dup()
    ids.scopes = scopes
    ids.method = 'and'
    return ids
  }

  dup() {
    return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
  }

  fetch = () => (dispatch, getState) => {
    this.state = getState()['cord'][this.cord.name]['ids']
    const scopes = this.getUnfetchedScopes()
    console.log(this.state, scopes, this.scopes, this)
    if (scopes.length > 0) {
      dispatch({type: 'CORD/fetchIds', payload: { table_name: this.cord.name, scopes }})
    }
  }

  getIds() {
    const ids = this.getFetchedScopes().reduce((ids, scope) => {
      if (this.state[scope].status === 'fetched') {
        return ids.concat(this.state[scope].data)
      } else {
        return null
      }
    }, []).filter(x=>x)
    console.log(ids)
    let filteredIds = []

    if (this.method === 'and') {
      filteredIds = ids.reduce((res, idArr) => {
        return res.filter(x => idArr.include(x))
      }, idArr[0])
    } else {
      filteredIds = ids.reduce((res, idArr) => {
        return [...res, ...idArr]
      }, [])
    }


    return [...new Set(filteredIds)]
  }

  getFetchedScopes() {
    return this.scopes.filter(scope => {
      const scopeObj = this.state[scope]
      return (scopeObj && scopeObj.status === 'fetched')
    })
  }

  getUnfetchedScopes() {
    return this.scopes.filter(scope => {
      const scopeObj = this.state[scope]
      return (scopeObj===undefined || scopeObj.status === null)
    })
  }


}
