const generateResponse = (successMessage) => {
  return {
    200: {
      description: successMessage
    },
    400: {
      description: 'Bad Request'
    },
    500: {
      description: 'Server Error'
    }
  }
}
const swaggerSpec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Web App Api',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        apiKeyHeader: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      },
      schemas: {
        Login: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email'
            },
            password: {
              type: 'string',
              description: 'Password'
            }
          },
          example: {
            email: 'tester010@email.com',
            password: 'tester12345'
          }
        },
        Register: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'username'
            },
            email: {
              type: 'string',
              description: 'Email'
            },
            password: {
              type: 'string',
              description: 'Password'
            }
          },
          example: {
            username: 'tester-010',
            email: 'tester010@email.com',
            password: 'tester12345'
          }
        },
        Project: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          },
          example: {
            name: 'Project 1'
          }
        },
        Card: {
          type: 'object',
          properties: {
            question: {
              type: 'string'
            },
            answer: {
              type: 'string'
            }
          },
          example: {
            question: 'What is the capital of Spain?',
            answer: 'Madrid'
          }
        },
        MoveCard: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            currentBoxId: {
              type: 'string'
            },
            newBoxId: {
              type: 'string'
            }
          }
        },
        UpdateCard: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            question: {
              type: 'string'
            },
            answer: {
              type: 'string'
            }
          }
        },
        Tag: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          }
        },
        UpdateTag: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'User',
        description: 'User related endpoints'
      },
      {
        name: 'Project',
        description: 'Project related endpoints'
      },
      {
        name: 'Card',
        description: 'Card related endpoints'
      },
      {
        name: 'Tag',
        description: 'Tag related endpoints'
      }
    ],
    // Auth paths
    paths: {
      '/api/login': {
        post: {
          tags: ['User'],
          summary: 'Login',
          description: 'Login Auth',
          requestBody: {
            description: 'Login',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Login'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Login Successfully')
        }
      },
      '/api/register': {
        post: {
          tags: ['User'],
          summary: 'Register',
          description: 'Register new user',
          requestBody: {
            description: 'Register',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Register'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Register success')
        }
      },
      // Project paths
      '/api/create-project': {
        post: {
          tags: ['Project'],
          summary: 'Create project',
          description: 'Create new project',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'Create project',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Create Project Successfully')
        }
      },
      '/api/projects': {
        get: {
          tags: ['Project'],
          summary: 'Get all projects',
          description: 'Return all user projects',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          responses: generateResponse('Get projects Successfully')
        }
      },
      '/api/projects/{id}': {
        get: {
          tags: ['Project'],
          summary: 'Find Project by id',
          description: 'Return a single Project',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'ID of Project to return',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: generateResponse('Get project Successfully')
        }
      },
      '/api/search-projects/{name}': {
        get: {
          tags: ['Project'],
          summary: 'Search projects by name',
          description: 'return search projects',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          parameters: [
            {
              name: 'name',
              in: 'path',
              description: 'Name of Project to return',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: generateResponse('Search projects successfully')
        }
      },
      // Card paths
      '/api/create-card': {
        post: {
          tags: ['Card'],
          summary: 'Create card',
          description: 'create new card',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'Create card',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Card'
                }
              },
              required: true
            }
          },
          responses: generateResponse('Create card successfully')
        }
      },
      '/api/move-card': {
        put: {
          tags: ['Card'],
          summary: 'move card',
          description: 'move card to other box',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'move card',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MoveCard'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Card moved successfully')
        }
      },
      '/api/update-card': {
        put: {
          tags: ['Card'],
          summary: 'Update card',
          description: 'Update card with new data',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'Update card',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateCard'
                }
              },
              required: true
            }
          },
          responses: generateResponse('Card updated successfully')
        }
      },
      // Tag paths
      '/api/create-tag': {
        post: {
          tags: ['Tag'],
          summary: 'Create tag',
          description: 'Create new tag',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'Create tag',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Tag'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Create tag successfully')
        }
      },
      '/api/tags': {
        get: {
          tags: ['Tag'],
          summary: 'Get tags',
          description: 'return all user tags',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          responses: generateResponse('Get tags successfully')
        }
      },
      '/api/search-tags/{name}': {
        get: {
          tags: ['Tag'],
          summary: 'Search tags by name',
          description: 'return search tags',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          parameters: [
            {
              name: 'name',
              in: 'path',
              description: 'Name of Tag to return',
              required: true
            }
          ],
          responses: generateResponse('Get tags successfully')
        }
      },
      '/api/update-tag': {
        put: {
          tags: ['Tag'],
          summary: 'Update tag',
          description: 'Update tag with new data',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          requestBody: {
            description: 'Update tag',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UpdateTag'
                }
              }
            },
            required: true
          },
          responses: generateResponse('Update tag successfully')
        }
      },
      '/api/delete-tag/{tagId}': {
        delete: {
          tags: ['Tag'],
          summary: 'Delete tag',
          description: 'Delete tag by id',
          security: [
            {
              apiKeyHeader: []
            }
          ],
          parameters: [
            {
              name: 'tagId',
              in: 'path',
              description: 'ID of Tag to delete',
              required: true
            }
          ],
          responses: generateResponse('Delete tag success')
        }
      }
    }
  },
  apis: ['./src/routes/*']
}

export default swaggerSpec
