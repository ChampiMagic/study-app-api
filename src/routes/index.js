// Instance Route
import { Router } from 'express'

// Import Controllers
import { register, login } from '../controllers/authController.js'
import { createProyect, getAllProjects, getProjectById} from '../controllers/proyectController.js'
import { createCard } from '../controllers/cardController.js'

import { protect } from '../middleware/protect.js'
const router = Router()

// PUBLIC ROUTES //

// Auth Routes
router.post('/register', register)

router.post('/login', login)

// PRIVATE ROUTES //

// Projet Routes
router.post('/create-project', protect, createProyect)
router.get("/projects", protect, getAllProjects);
router.get('/projects/:id', protect, getProjectById)

// Card Routes
router.post('/create-card', protect, createCard)

export default router
