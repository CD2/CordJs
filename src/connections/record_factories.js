
const whenIdIsFunction = (id) =>
  (typeof id === 'function')
  ? (props) => id.call(null, props)
  : undefined

const whenIdIsString = (id) =>
  (typeof id === 'string')
  ? (props) => props[id]
  : undefined

const whenIdIsNumber = (id) =>
  (typeof id === 'number')
  ? (props) => id
  : undefined

export const idFactories = [
  whenIdIsFunction,
  whenIdIsString,
  whenIdIsNumber,
]


const whenAttributesIsFunction = (attributes) =>
  (typeof attributes === 'function')
  ? (props) => attributes.call(null, props)
  : undefined

const whenAttributesIsArray = (attributes) =>
  Array.isArray(attributes)
  ? (props) => attributes
  : undefined

const whenAttributesIsString = (attributes) =>
  (typeof attributes === 'string')
  ? (props) => [attributes]
  : undefined

export const attributesFactories = [
  whenAttributesIsFunction,
  whenAttributesIsArray,
  whenAttributesIsString,
]
