const builder = require('./index')
const jsonSchemas = require('./test/schemas')
const { printSchema, GraphQLSchema } = require('graphql')

const schema = builder(jsonSchemas)

const graphQlSchema = schema

console.log(printSchema(graphQlSchema))