export { default as CordStore } from './cord_store'
export { default as Cord } from './cord'
export { default as Provider } from './provider'


/*

// IDS

// generate prop name from scope name
@Articles.connect_ids(...scopes) #=> {article_ids: ALL, scope_ids: [1,2,3], scope2: [3,4,5]}

// pass array of ids and map result to props
@Articles.connect_ids((ids, props) => ({
  my_ids: ids.get('all'),
  all_video_ids: ids.get('thing')
}))

@Articles.connect_ids((ids, props) => ({
  published_ids: ids.get('published').or('important').and('another_scope')
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


*/
