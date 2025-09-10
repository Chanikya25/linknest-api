import { Router } from 'express';
import { register, login } from '../controllers/authController'; // <-- ADD 'login' HERE

const router = Router();

router.post('/register', register);
router.post('/login', login); // <-- AND ADD THIS NEW LINE

export default router;