import axios from 'axios'

/*
  CordStore

  Provides a place for global configuration such as the base url for the api

  Holds a reference of all available cords and provides centralized
  functionallity for each, such as http requests
*/

export default class CordStore {

  reducer_key = 'cord'
  cords = {}

  constructor({
    base_url,
    http_headers={},
  } = {}) {
    this.base_url = base_url
    this.http_headers = http_headers
  }

  /*
    Register a cord record with the cord store
  */
  register(cord) {
    cord.setupStore(this)
    this.cords[cord.names.reducer_key] = cord
  }

  setupStore(store) {
    this._store = store
  }

  getCord(name) {
    this.cords[name]
  }

  defaultInstanceObject = {
    records: {},
    ids: {},
  }
    // articles: {
    //   records: {1: {id: 1, name: 'asdsda'}, 2: {}, 3: {}},
    //   ids: {
    //     all: [1,2,3,4,5,6],
    //     ordered: [1,2,4,6,5,3],
    //     published: [1,2,4],
    //   },
    // }

  actions = {
    process_response: 'CORD/process_response',
    fetch_ids: 'CORD/fetch_ids',
    fetch_records: 'CORD/fetch_records',
  }

  reducer = (state={}, action) => {
    switch (action.type) {
      case this.actions.fetch_ids: {
        const { table_name, scopes } = action.payload
        state  = {...state}
        const cord_state = {...(state[table_name] || this.defaultInstanceObject)}
        const ids_state = cord_state['ids']
        scopes.forEach(scope => {
          ids_state[scope] = (ids_state[scope])? {...ids_state[scope]} : {status: null, data: []}
          ids_state[scope].status = 'fetching'
        })
        state[table_name] = cord_state
        return state
      }
      case this.actions.fetch_records: {
        const { table_name, ids } = action.payload
        state  = {...state}
        const cord_state = {...(state[table_name] || this.defaultInstanceObject)}
        const record_state = cord_state['records']
        ids.forEach(id => {
          record_state[id] = (record_state[id])? {...record_state[id]} : {status: null, data: {}}
          record_state[id].status = 'fetching'
        })
        state[table_name] = cord_state
        return state
      }
      case this.actions.process_response: {
        state = {...state}
        Object.entries(action.payload.cord_response).forEach(([table_name, data]) => {
          const table_state = {...(state[table_name] || this.defaultInstanceObject)}

          //Ids
          console.log(table_state, table_name, data['ids'])
          Object.entries(data['ids'] || {}).forEach(([scope, ids]) => {
            table_state['ids'][scope] = {status: 'fetched', data: ids}
          });

          //Records
          // console.log(table_name, data['records'])
          (data['records'] || []).forEach(newRecord => {
            const { id } = newRecord
            const currentRecord = table_state['records'][id] || {}
            table_state['records'][id] = {...currentRecord, ...newRecord}
          })

          state[table_name] = table_state
        })
        return state
      }
    }

    return state
  }

  reducerKey() {
    return this.reducer_key
  }

  reducerPair() {
    return {[this.reducerKey()]: this.reducer}
  }

  network = {
    request: (method, url, options={}) => axios({method, url, ...options, headers: this.http_headers}),
    get: (url, params={}) => this.network.request('get', url, {params}),
    post: (url, data={}) => this.network.request('post', url, {data}),
    put: (url, data={}) => this.network.request('put', url, {data}),
    del: (url, data={}) => this.network.request('delete', url, {data}),
  }

}

// response = {
//   articles: {
//     records: [],
//     ids: {
//       all: [],
//       scoped: [],
//     },
//   }
// }
//
// store = {
//   articles: {
//     records: {},
//     ids: {
//       all: {
//         state: 'fetched'
//       }
//     }
//   }
// }

/*

{
  type: 'CORD/process_response',
  payload: {
    cord_response: {
      articles: {
        records: [{id: 1, name: 'first'}, {id: 5, name: 'the fifth'}],
        ids: {
          all: [1,2,3,4,5,6,7,8],
          published: [1,2,7,8],
        }
      }
    }
  }
}


@Cord.fetchIds('articles')




// IDS

// generate prop name from scope name
@Articles.connect_ids(...scopes) #=> {article_ids: ALL, scope_ids: [1,2,3], scope2: [3,4,5]}

// pass array of ids and map result to props
@Articles.connect_ids((ids, props) => ({
  my_ids: ids.get('all'),
  all_video_ids: ids.get('thing')
}))

// ACTIONS

// pass trigger method which calls an action. Results are mapped to props
@Articles.connect_actions((trigger, props) => ({
  vote_up: (id) => trigger('vote_up', id)
}))

// auto map from string names
@Articles.connect_actions('vote_up', 'vote_down')

// RECORDS

// pass fetch in which queries the store, results mapped to props
@Articles.connect_records((fetch, props) => ({
  articles: fetch([1,2,3,4], data: {tags: props.tags}, attributes: ['asdas', 'asd'], preload: false),
  article: fetch(1),
})


export default {
  connect,
  connect_ids,
  connect_record,
  connect_actions,
}


















*/
