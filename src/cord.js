import React from 'react'
import connectIds from './connections/ids'
import connectIdFetcher from './connections/id_fetcher'
import connectRecord from './connections/record'

export default class Cord {

  constructor(name, { path, table_name, prop, as }={}) {
    this.name = name
    this.path = (path !== undefined) ? path : name
    this.table_name = (table_name !== undefined) ? table_name : name
    this.defaultAs = (as !== undefined) ? as : name
    this.defaultPropName = (prop !== undefined) ? prop : `${name}_id`
  }

  connectIds = connectIds
  connectIdFetcher = connectIdFetcher
  connectRecord = connectRecord

}
