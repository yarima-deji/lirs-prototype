import express from 'express';
import dotenv from 'dotenv';
import { initUserTable } from './models/userModel.js';
import { initParcelTable } from './models/parcelModel.js';
import { initAuditTable } from './models/auditModel.js';
import authRoutes from './routes/auth.js';
import parcelRoutes from './routes/parcels.js';

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

// Parcel routes
app.use('/parcels', parcelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error' });
});

// Initialize DB tables before starting the server
initUserTable()
  .then(() => initParcelTable())
  .then(() => console.log('✅ DB tables ready'))
  .catch(err => {
    console.error('❌ Failed to initialize database tables', err);
    process.exit(1);
  });

initUserTable()
  .then(() => initParcelTable())
  .then(() => initAuditTable())
  .then(() => console.log('✅ All DB tables ready'))
  .catch(err => { console.error(err); process.exit(1); });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
