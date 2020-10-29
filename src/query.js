const { GraphQLInt, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLObjectType, GraphQLList, GraphQLInputObjectType, GraphQLEnumType } = require('graphql')
const { forEach, size, isArray, map } = require('lodash')

const types = {}
const queryFields = {}

const LogicOperatorType = new GraphQLEnumType({
  name: 'LogicOperators',
  values: {
    OR: {
      value: 'OR'
    },
    AND: {
      value: 'AND'
    }
  }
})

const WhereType = new GraphQLInputObjectType({
  name: 'WhereType',
  fields: {
    field: {
      type: GraphQLString
    },
    operator: {
      type: GraphQLString
    },
    values: {
      type: GraphQLList(GraphQLString)
    },
    logicOperator: {
      type: LogicOperatorType
    }
  }
})

const WheresType = new GraphQLInputObjectType({
  name: 'WheresType',
  fields: {
    where: {
      type: GraphQLList(WhereType)
    }
  }
})

const findById = (query, id) => query.findById(id)
const offset = (query, value) => query.offset(value)
const limit = (query, value) => query.limit(value)
const orderBy = (query, value, type = 'ASC') => query.orderBy(value, type)
const wheres = (query, wheres) => {
  query.where(builder => {
    for(let index in wheres) {
      const where = wheres[index]
      if (where.logicOperator === 'AND') {
        
      } else {
        builder.whereIn(where.field, where.values)
      }
    }
    return builder
  })
  
}

const getResolver = async (input, model, isSingle) => {
  const query = model.query().select('*')
  let count = 0
  let total = 0
  if (input.id) {
    findById(query, input.id)
  }
  total = size((await query))
  if (size(input.wheres) > 0) {
    wheres(query, input.wheres)
  }
  if (input.orderBy) {
    orderBy(query, input.orderBy, input.orderByType)
  }
  if (input.offset) {
    offset(query, input.offset)
  }
  if (input.limit) {
    limit(query, input.limit)
  }
  // forEach(model.relationMappings, (relation, relationName) => query.withGraphFetched(relationName))
  forEach(model.relationMappings, (relation, relationName) => {
    result = createQueries(types, relation.modelClass)
    // console.log(result)
    query.withGraphFetched(relationName)
  })
  // console.log(query.toKnexQuery().toSQL())
  const results = (await query)
  count = size(results)
  if (isSingle) {
    return results[0]
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
        },
        orderBy: {
          type: GraphQLString
        },
        orderByType: {
          type: GraphQLString
        },
        wheres: {
          type: WheresType
        }
      },
      resolve: (root, input, context) => getResolver(input, model, isSingle)
    }
  })
  // console.log(queryFields)
  return queryFields
}

module.exports = createQueries