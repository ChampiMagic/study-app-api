// import other things
import cors from 'cors'
import 'dotenv/config'
import errorHandler from './src/middleware/errorHandler.js'
import router from './src/routes/index.js'

// swagger
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerSpec from './utils/swaggerSpec.js'

// initialization of MongoDB
import './db.js'

// initialization of App
import express from 'express'
const app = express()

// Config of App Middlewares
app.use(express.json())
app.use(cors())

app.use('/api', router)

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)))

// Config of App Error Middleware
app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`)
})
