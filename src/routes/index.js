// Instance Route
import { Router } from 'express'

// Import Controllers
import { register, login } from '../controllers/authController.js'
import { createProject, getAllProjects, getProjectById, getProjectsByName } from '../controllers/projectController.js'
import { createCard, moveCard, updateCard } from '../controllers/cardController.js'
import { createTag, getTags, getTagsByName } from '../controllers/tagController.js'

import { protect } from '../middleware/protect.js'
const router = Router()

// PUBLIC ROUTES //

// Auth Routes
router.post('/register', register)
router.post('/login', login)

// PRIVATE ROUTES //

// Projet Routes
router.post('/create-project', protect, createProject)
router.get('/projects', protect, getAllProjects)
router.get('/projects/:id', protect, getProjectById)
router.get('/search-projects/:name', protect, getProjectsByName)

// Card Routes
router.post('/create-card', protect, createCard)
router.put('/move-card', protect, moveCard)
router.get('/update-card', protect, updateCard)

// Tag Routes
router.post('/create-tag', protect, createTag)
router.get('/tags', protect, getTags)
router.get('/tags/:name', protect, getTagsByName)

export default router
