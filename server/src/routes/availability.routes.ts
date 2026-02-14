
import { createAvailability, getAvailabilitiesByLinkId } from '#controller/availability.controller.ts';
import { authenticateToken } from '#middlewares/auth.middleware.ts';
import { validate } from '#middlewares/zod.middleware.ts';
import { availabilityLinkIdSchema, createAvailabilitySchema } from '#validators/availibility.validator.ts';

import { Router } from 'express';

const router = Router();

router.get('/', authenticateToken, validate(createAvailabilitySchema), createAvailability)
router.post('/link/:bookingLinkId', authenticateToken, validate(availabilityLinkIdSchema), getAvailabilitiesByLinkId)

export default router;
