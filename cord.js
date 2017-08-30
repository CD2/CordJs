

class Cord {

  static IdsClass = require('./ids').default

  constructor(name, {options}={}) {
    this.name = name
    this.names = {
      reducer_key: name,
    }
  }

  //STORE STUFF

  setupStore(cordStore) {
    this._cordStore = cordStore
  }

  cordStore() {
    if (this._cordStore === undefined) {
      throw new Error(`Cord(${this.name}) can not be used outside of a cord store. You likely forgot to call \`register\` on the CordStore`)
    }
    return this._cordStore
  }

  getState(...args) {
    return this.cordStore().getState(...args)
  }

  dispatch(...args) {
    return this.cordStore().dispatch(...args)
  }

  //


  ids(state) {
    state = state['cord'][this.name]['ids']
    return new Cord.IdsClass(this, state)
  }

  //DSL
  action_for(name, callback=(execute, params)=>execute(params)) {
    const execute = () => {
      this.request().post(`perform/${name}`)
    }


  }


}

import connections_methods from './connections'

Object.entries(connections_methods).forEach(([name, callback]) => {
  Cord.prototype[name] = callback
})

export default Cord
