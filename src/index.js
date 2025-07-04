import express from 'express';
import dotenv from 'dotenv';
import { initUserTable } from './models/userModel.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('🎉 LIRS API is running');
});

// Auth routes
app.use('/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler (omit unused next)
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

// Initialize DB tables before starting the server
initUserTable()
  .then(() => console.log('✅ User table is ready'))
  .catch(err => {
    console.error('❌ Failed to initialize user table', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
