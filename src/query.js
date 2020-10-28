const { GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean } = require('graphql')
const { forEach, size, isArray, cloneDeep } = require('lodash')

const findById = (query, id) => query.findById(id)
const offset = (query, value) => query.offset(value)
const limit = (query, value) => query.limit(value)

const getResolver = async (input, model, isSingle) => {
  const query = model.query()
  let count = 0
  let total = 0
  if (input.id) {
    findById(query, input.id)
  }
  total = size((await query))
  if (input.offset) {
    offset(query, input.offset)
  }
  if (input.limit) {
    limit(query, input.limit)
  }
  const results = (await query)
  count = size(results)
  if (isSingle) {
    return results
  }
  return {
    data: isArray(results) ? results : [results],
    count,
    total
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
        },
        offset: {
          type: GraphQLInt
        },
        limit: {
          type: GraphQLInt
        }
      },
      resolve: (root, input) => getResolver(input, model, isSingle)
    }
  })
  return queryFields
}

module.exports = createQueries