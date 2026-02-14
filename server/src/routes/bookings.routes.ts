import { Router } from 'express';
import { validate } from '#middlewares/zod.middleware.ts';
import { createBookingSchema, getBookingsByCodeSchema } from '#validators/booking.validator.ts';
import { createBooking, getBookingsByLink } from '#controller/bookings.controller.ts';

const router = Router();

// Public routes (no authentication required)
router.post('/:code', validate(createBookingSchema), createBooking);

router.get('/:code', validate(getBookingsByCodeSchema), getBookingsByLink);

export default router;

