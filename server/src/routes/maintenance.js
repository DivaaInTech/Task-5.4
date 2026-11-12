import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { csrfProtection } from '../middleware/csrf.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest
} from '../controllers/maintenanceController.js';

const router = Router();

// Reading is public; writing requires a logged-in user.
//
// VULNERABLE on two fronts:
//   1. CSRF — the write routes trust the auth cookie alone. There is no
//      anti-CSRF token, so any website the victim visits can forge a
//      state-changing request in the victim's name (the browser attaches the
//      cookie automatically).
//   2. DoS — there is no rate limiting anywhere, so the public list endpoint
//      (and the writes) can be flooded with unlimited requests to exhaust the
//      server.
router.use(rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false }));
router.get('/', getAllRequests);
router.get('/:id', getRequest);
router.post('/', requireAuth, csrfProtection, createRequest);
router.patch('/:id', requireAuth, csrfProtection, updateRequest);
router.delete('/:id', requireAuth, csrfProtection, deleteRequest);

export default router;
