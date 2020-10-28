const brandModelSchema = {
  name: 'Brand',
  jsonSchema: {
    $id: '#/Brand',
    type: 'object',
    required: ['id', 'website', 'name', 'link'],
    properties: {
      id: { type: 'string' },
      website: { type: 'string' },
      name: { type: 'string' },
      link: { type: 'string' },
      products: {
        type: 'array',
        items: {
          $ref: '#/Product'
        }
      }
    }
  }
}

const productModelSchema = {
  name: 'Product',
  jsonSchema: {
    $id: '#/Product',
    type: 'object',
    required: ['id', 'name', 'link', 'fk_brand_id'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      link: { type: 'string' },
      fk_brand_id: { type: 'string' }
    }
  }
}

module.exports = {
  Brand: brandModelSchema,
  Product: productModelSchema
}