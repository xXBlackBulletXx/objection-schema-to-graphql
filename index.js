const { default: convert } = require('jsonschema2graphql')
const { map } = require('lodash')

const entryPoints = types => {
  console.log(types)
  return {
    query: {
      name: 'RootQuery',
      fields: {
        
      }
    }
  }
}

const createSchema = (models) => {
  // console.log(convert)
  const schemas = map(models, model => ({
    $id: model.name,
    ...model.jsonSchema
  }))
  const queryConvertion = convert({ jsonSchema: schemas, entryPoints })
  console.log(queryConvertion)
  return queryConvertion
}

module.exports = createSchema