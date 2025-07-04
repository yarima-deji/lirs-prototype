import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
// import controller functions when ready

const router = Router();

// All parcel routes require authentication
router.use(authenticateToken);

// POST /parcels — Create new parcel
router.post('/', authorizeRole('admin', 'officer'), (req, res) => {
  // TODO: call createParcel and return 201
  res.status(201).json({ message: 'Create parcel endpoint' });
});

// GET /parcels — List parcels with optional filters
router.get('/', (req, res) => {
  // TODO: call getParcels and return list
  res.json({ message: 'List parcels endpoint' });
});

// GET /parcels/:id — Get parcel details
router.get('/:id', (req, res) => {
  // TODO: call getParcelById and return record
  res.json({ message: 'Get parcel details endpoint' });
});

// PUT /parcels/:id — Update parcel
router.put('/:id', authorizeRole('admin', 'officer'), (req, res) => {
  // TODO: call updateParcel and return updated
  res.json({ message: 'Update parcel endpoint' });
});

// DELETE /parcels/:id — Soft-delete parcel
router.delete('/:id', authorizeRole('admin'), (req, res) => {
  // TODO: call softDeleteParcel and return 204
  res.status(204).end();
});

export default router;

