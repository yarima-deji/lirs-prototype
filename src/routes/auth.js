import { Router } from 'express';

const router = Router();

// Stub for POST /auth/register
router.post('/register', (req, res) => {
  res.send('Register endpoint');
});

// Stub for POST /auth/login
router.post('/login', (req, res) => {
  res.send('Login endpoint');
});

export default router;

