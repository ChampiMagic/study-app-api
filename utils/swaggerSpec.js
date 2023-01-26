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
          description: 'Login',
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
          responses: generateResponse('Login success')
        }
      },
      '/api/register': {
        post: {
          tags: ['User'],
          summary: 'Register',
          description: 'Register',
          requestBody: {
            description: 'Register',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Register'
                }
              }
            },
            responses: generateResponse('Register success'),
            required: true
          }
        }
      },
      // Project paths
      '/api/create-project': {
        post: {
          tags: ['Project'],
          summary: 'Create project',
          description: 'Create project',
          requestBody: {
            description: 'Create project',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Project'
                }
              }
            }
          }
        }
      },
      '/api/projects': {
        get: {
          tags: ['Project'],
          summary: 'Get all projects',
          description: 'get projects'
        }
      },
      '/api/projects/:id': {
        get: {
          tags: ['Project']
        }
      },
      '/api/search-projects/:name': {
        get: {
          tags: ['Project']
        }
      },
      // Card paths
      '/api/crate-card': {
        post: {
          tags: ['Card']
        }
      },
      '/api/move-card': {
        put: {
          tags: ['Card']
        }
      },
      '/api/update-card': {
        put: {
          tags: ['Card']
        }
      },
      // Tag paths
      '/api/create-tag': {
        post: {
          tags: ['Tag']
        }
      },
      '/api/tags': {
        get: {
          tags: ['Tag']
        }
      },
      '/api/search-tags/:name': {
        get: {
          tags: ['Tag']
        }
      },
      '/api/update-tag': {
        put: {
          tags: ['Tag']
        }
      },
      '/api/delete-tag/:tagId': {
        delete: {
          tags: ['Tag']
        }
      }
    }
  },
  apis: ['./src/routes/*']
}

export default swaggerSpec
