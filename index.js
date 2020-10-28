const { default: convert } = require('jsonschema2graphql')
const { forEach } = require('lodash')
const createQueries = require('./src/query')
const { createJsonSchema } = require('./src/types')

const entryPoints = (types, graphqli, models) => {
  // console.log(models)
  const queryFields = createQueries(types, models)
  const mutations = {}
  forEach(types, (type, key) => {
    mutations[key] = {

    }
  })
  // console.log(queryFields)
  return {
    query: new graphqli.GraphQLObjectType({
      name: 'RootQuery',
      fields: queryFields
    }),
    // mutation: new graphqli.GraphQLObjectType({
    //   name: 'RootMutation',
    //   fields: {}
    // })
  }
}

const createSchema = (models, graphqli) => {
  const jsonSchema = createJsonSchema(models)
  // console.log(schemas)
  const queryConvertion = convert({
    jsonSchema,
    entryPoints: types => entryPoints(types, graphqli, models)
  })
  return queryConvertion
}

module.exports = createSchema