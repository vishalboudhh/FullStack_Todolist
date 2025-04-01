// In routes/user.routes.js
import express from 'express';
import { login, logout, register, getCurrentUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(getCurrentUser); // new route

export default router;
