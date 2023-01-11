// Instance Route
import { Router } from 'express';
const router = Router();

// Import Controllers
import { register, login } from '../controllers/authController.js';
import { createProyect } from '../controllers/proyectController.js';

import { protect } from '../middleware/protect.js'


// PUBLIC ROUTES //

// Auth Routes
router.post('/register', register); 

router.post('/login', login); 


// PRIVATE ROUTES //

// Projet Routes
router.post('/create-proyect', protect, createProyect)


export default router;