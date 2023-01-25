const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Web App Api',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*']
}

export default swaggerSpec
