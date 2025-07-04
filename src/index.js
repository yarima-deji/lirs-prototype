import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('LIRS API is running'));

// Import auth routes (you’ll make this next)
import authRoutes from './routes/auth.js';
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
