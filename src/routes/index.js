// Instance Route
import { Router } from 'express';
const router = Router();

// Import Controllers
import { register, login } from '../controllers/authController.js';



// Auth Routes
router.post('/register', register); 

router.post('/login', login); 


export default router;