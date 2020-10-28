const { map } = require("lodash")

const getQueryTypes = (models) => {
  const schemas = map(models, model => ({
    $id: `#/${model.name}`,
    ...model.jsonSchema
  }))
  const schemasMultiple = map(models, model => ({
    $id: `#/${model.name}s`,
    $model: `#/${model.name}`,
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          $ref: `#/${model.name}`
        }
      },
      count: { type: 'number' }
    }
  }))
  return [
    ...schemas,
    ...schemasMultiple
  ]
}

const getInputTypes = (models) => {
  const schema = map(models, model => ({
    $id: `#/${model.name}Input`,
    
  }))
}

const createJsonSchema = (models) => {
  return [
    ...getQueryTypes(models),
    // ...getInputTypes(models)
  ]
}

module.exports = {
  createJsonSchema
}