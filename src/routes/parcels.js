import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { createParcel, getParcels } from '../models/parcelModel.js';

const router = Router();

// All parcel routes require authentication
router.use(authenticateToken);

// POST /parcels — Create new parcel
router.post('/', authorizeRole('admin', 'officer'), async (req, res, next) => {
  try {
    const parcelData = req.body; 
    const newParcel = await createParcel(parcelData);
    res.status(201).json(newParcel);
  } catch (err) {
    next(err);
  }
});

// GET /parcels — List parcels with optional filters
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      parcel_id: req.query.parcel_id,
      owner_name: req.query.owner_name,
      minLat: req.query.minLat ? parseFloat(req.query.minLat) : undefined,
      maxLat: req.query.maxLat ? parseFloat(req.query.maxLat) : undefined,
      minLng: req.query.minLng ? parseFloat(req.query.minLng) : undefined,
      maxLng: req.query.maxLng ? parseFloat(req.query.maxLng) : undefined,
    };
    const parcels = await getParcels(filters);
    res.json(parcels);
  } catch (err) {
    next(err);
  }
});

// GET /parcels/:id — Get parcel details
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    // TODO: implement getParcelById
    res.json({ message: `Get parcel details endpoint for id ${id}` });
  } catch (err) {
    next(err);
  }
});

// PUT /parcels/:id — Update parcel
router.put('/:id', authorizeRole('admin', 'officer'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    // TODO: implement updateParcel
    res.json({ message: `Update parcel endpoint for id ${id}` });
  } catch (err) {
    next(err);
  }
});

// DELETE /parcels/:id — Soft-delete parcel
router.delete('/:id', authorizeRole('admin'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    // TODO: implement softDeleteParcel
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
