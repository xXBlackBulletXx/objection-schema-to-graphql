const { GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean } = require('graphql')
const { forEach, size, isArray } = require('lodash')

const findById = (query, id) => query.findById(id)

const getResolver = async (input, model, isSingle) => {
  const query = model.query()
  if (input[model.idColumn]) {
    findById(query, input[model.idColumn])
  }
  const results = (await query)
  if (isSingle) {
    return results
  }
  const count = size(results)
  return {
    data: isArray(results) ? results : [results],
    count
  }
}

const BASIC_TYPE_MAPPING = {
  string: GraphQLString,
  integer: GraphQLInt,
  number: GraphQLFloat,
  boolean: GraphQLBoolean,
}

const createQueries = (types, models) => {
  const queryFields = {}
  forEach(types, (type, key) => {
    const isSingle = key.substr(key.length - 1) !== 's'
    const realModelName = !isSingle ? key.slice(0, key.length - 1) : key
    const model = models[realModelName]
    queryFields[key] = {
      type,
      args: {
        id: {
          type: BASIC_TYPE_MAPPING[model.jsonSchema.properties[model.idColumn].type]
        }
      },
      resolve: (root, input) => getResolver(input, model, isSingle)
    }
  })
  return queryFields
}

module.exports = createQueries