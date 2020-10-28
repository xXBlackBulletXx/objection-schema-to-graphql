const { default: convert } = require('jsonschema2graphql')
const { map, forEach, mapKeys, reduce } = require('lodash')

const entryPoints = (types, graphqli) => {
  // console.log(models)
  const fields = {}
  forEach(types, (type, key) => {
    fields[key] = {
      type
    }
  })
  return {
    query: new graphqli.GraphQLObjectType({
      name: 'RootQuery',
      fields
    })
  }
}

const createSchema = (models, graphqli) => {
  const schemas = map(models, model => ({
    $id: `#/${model.name}`,
    ...model.jsonSchema
  }))
  const queryConvertion = convert({ jsonSchema: schemas, entryPoints: types => entryPoints(types, graphqli) })
  return queryConvertion
}

module.exports = createSchema