// Instance Route
import { Router } from 'express'

// Import Controllers
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js'
import { createProject, deleteProject, getAllProjects, getProjectById, getProjectsByName, updateProject } from '../controllers/projectController.js'
import { createCard, deleteCard, getAllCards, getCardByName, moveCard, randomCard, updateCard } from '../controllers/cardController.js'
import { createTag, deleteTag, getTags, getTagsByName, updateTag } from '../controllers/tagController.js'

import { protect } from '../middleware/protect.js'
const router = Router()

// PUBLIC ROUTES //

// Auth Routes
router.post('/register', register)
router.post('/login', login)
router.put('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)

// PRIVATE ROUTES //

// Projet Routes
router.post('/create-project', protect, createProject)
router.get('/projects', protect, getAllProjects)
router.get('/project/:id', protect, getProjectById)
router.get('/search-projects/:name', protect, getProjectsByName)
router.delete('/delete-project/:projectId', protect, deleteProject)
router.put('/update-project', protect, updateProject)

// Card Routes
router.post('/create-card', protect, createCard)
router.put('/move-card', protect, moveCard)
router.put('/update-card', protect, updateCard)
router.get('/random-card', protect, randomCard)
router.get('/card', protect, getAllCards)
router.get('/search-card', protect, getCardByName)
router.delete('/delete-card', protect, deleteCard)

// Tag Routes
router.post('/create-tag', protect, createTag)
router.get('/tags', protect, getTags)
router.get('/search-tags/:name', protect, getTagsByName)
router.put('/update-tag', protect, updateTag)
router.delete('/delete-tag/:tagId', protect, deleteTag)

export default router
