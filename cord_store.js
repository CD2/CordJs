import { observable } from 'mobx'
import axios from 'axios'

const get = (url, params) => axios.get(url, { params })
const post = (url, data) => axios.post(url, { data })

const defaultHttp = { get, post }

export default class CordStore {

  http_methods = defaultHttp

  constructor({ base_url, http_methods, reducer_key='cord' }={}) {
    this.base_url = base_url
    this.reducer_key = reducer_key
    this.http_methods = {...this.http_methods, ...http_methods}

    window.store = this.data
  }

  request = (method, path, data) => {
    const url = `${this.base_url}/${path}`
    return this.http_methods[method](url, data).then(response => {
      this.processResponse(response.data)
      return response.data
    })
  }

  get = (...args) => {
    return this.request('get', ...args)
  }

  post = (...args) => {
    return this.request('post', ...args)
  }

  idsPath(base_path) {
    return `${base_path}/ids`
  }

  recordsPath(base_path) {
    return base_path
  }

  actionsPath(base_path) {
    return `${base_path}/perform`
  }

  @observable data = {}

  getTableData(table_name) {
    if (!this.data.hasOwnProperty(table_name)) {
      this.data[table_name] = { records: observable.shallowMap(), ids: observable.map() }
    }
    return this.data[table_name]
  }

  getDataKey(data) {
    return JSON.stringify(data)
  }

  fetchIds(cord, data) {
    if (!this.idsLoaded(cord, data)) {
      const path = this.idsPath(cord.path)
      return this.get(path, data)
    }
  }

  fetchIdsReturnPromise(cord, data) {
    return this.fetchIds(cord, data) || Promise.resolve(this.getIds(cord, data))
  }

  getIds(cord, data) {
    // const key = this.getDataKey(data)
    return this.getTableData(cord.table_name).ids.get(data.scope)
  }

  idsLoaded(cord, data) {
    // const key = this.getDataKey(data)
    console.log(data, this.getTableData(cord.table_name).ids)
    return this.getTableData(cord.table_name).ids.has(data.scope)
  }

  fetchRecord(cord, id, attributes=[], { reload=false }={}) {
    if (reload || !this.isRecordLoaded(cord, id, attributes)) {
      const path = this.recordsPath(cord.path)
      this.get(path, { ids: id, attributes })
    }
  }

  getRecord(cord, id) {
    return this.getTableData(cord.table_name).records.get(id)
  }

  isRecordLoaded(cord, id, attributes=[]) {
    const { records } = this.getTableData(cord.table_name)

    if (!records.has(id)) return false
    const loaded_attributes = Object.keys(records.get(id))
    return attributes.every(attr => loaded_attributes.includes(attr))
  }

  processResponse = (data) => {
    Object.entries(data).forEach(([table_name, singleCordData]) => {
      const table_data = this.getTableData(table_name)

      //IDS
      if (singleCordData.hasOwnProperty('ids')) {
        Object.entries(singleCordData.ids).map(([scope_name, ids]) => {
          table_data.ids.set(scope_name, ids)
        })
      }

      //RECORDS
      if (singleCordData.hasOwnProperty('records')) {
        singleCordData.records.map(record => {
          const record_data = table_data.records.get(record.id)
          const new_record = {...record_data, ...record}
          table_data.records.set(record.id, new_record)
        })
      }
    })
  }

  // initialState() {
  //   const cordInitialState = {
  //     records: {},
  //     ids: {},
  //   }
  //   const state = {}
  //   this.cords.forEach(cord => {
  //     state[cord.table_name] = {...cordInitialState}
  //   })
  //   return state
  // }


}
