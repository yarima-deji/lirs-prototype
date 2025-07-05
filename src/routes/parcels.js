import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import {
  createParcel,
  getParcels,
  getParcelById,
  updateParcel,
  softDeleteParcel,
} from '../models/parcelModel.js';
import { logAudit } from '../models/auditModel.js';

const router = Router();

// All parcel routes require authentication
router.use(authenticateToken);

// POST /parcels — Create new parcel
router.post('/', authorizeRole('admin', 'officer'), async (req, res, next) => {
  try {
    const parcelData = req.body;
    const newParcel = await createParcel(parcelData);
    await logAudit({
      userId: req.user.sub,
      action: 'create',
      entity: 'parcel',
      entityId: newParcel.id,
      details: { parcel_id: newParcel.parcel_id }
    });
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

// GET /parcels/:id — Retrieve parcel details
router.get('/:id', async (req, res, next) => {
  try {
    const parcel = await getParcelById(req.params.id);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    res.json(parcel);
  } catch (err) {
    next(err);
  }
});

// PUT /parcels/:id — Update parcel
router.put('/:id', authorizeRole('admin', 'officer'), async (req, res, next) => {
  try {
    const updated = await updateParcel(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    await logAudit({
      userId: req.user.sub,
      action: 'update',
      entity: 'parcel',
      entityId: updated.id,
      details: req.body
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /parcels/:id — Soft‑delete parcel
router.delete('/:id', authorizeRole('admin'), async (req, res, next) => {
  try {
    const deleted = await softDeleteParcel(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    await logAudit({
      userId: req.user.sub,
      action: 'delete',
      entity: 'parcel',
      entityId: deleted.id,
      details: {}
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
