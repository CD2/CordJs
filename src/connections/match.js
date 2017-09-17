export default (arg, factories, name) => {
  for (let i=0; i<factories.length; i++) {
    const result = factories[i](arg)
    if (result !== undefined) return result
  }
  throw new Error(`invalid type of ${typeof arg} supplied for ${name}`)
}
