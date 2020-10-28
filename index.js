const { GraphQLObjectType } = require('graphql')
const { default: convert } = require('jsonschema2graphql')
const { map, forEach, mapKeys, reduce } = require('lodash')

const entryPoints = (types, models) => {
  // console.log(models)
  const fields = {}
  forEach(types, (type, key) => {
    fields[key] = {
      type
    }
  })
  return {
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields
    })
  }
}

const createSchema = (models) => {
  const schemas = map(models, model => ({
    $id: `#/${model.name}`,
    ...model.jsonSchema
  }))
  const queryConvertion = convert({ jsonSchema: schemas, entryPoints: types => entryPoints(types, models) })
  return queryConvertion
}

module.exports = createSchema