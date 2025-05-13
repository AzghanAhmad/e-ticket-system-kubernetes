import express from 'express';
import {
    resetPasswordRequest,
    resetPassword,
} from '../controllers/adminController.js';
import { registerUser,
    loginUser,addUser}
 from '../controllers/userController.js';


const router = express.Router();

// Signup and Login
router.post('/signup',registerUser);
router.post('/login', loginUser);
router.post('/users',addUser);

// Password Reset
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password/:token', resetPassword);

export default router;

