import { Router } from 'express';
import { validate } from '#middlewares/zod.middleware.ts';
import {
    bookingLinkCodeSchema,
    availableTimeSlotsSchema,
} from '#validators/booking-link.validator.ts';
import { authenticateToken } from '#middlewares/auth.middleware.ts';
import { generateBookingLink, getAvailableDates, getAvailableTimeSlots, getBookingLinkByCode, getUserBookingLinks } from '#controller/booking-link.controller.ts';

const router = Router();

// Protected routes (require authentication)
router.post('/generate', authenticateToken, generateBookingLink);
router.get('/my-links', authenticateToken, getUserBookingLinks);

// Public routes (no authentication required)
router.get('/:code', validate(bookingLinkCodeSchema), getBookingLinkByCode);

router.get(
    '/:code/dates',
    validate(bookingLinkCodeSchema),
    getAvailableDates
);

router.get(
    '/:code/timeslots/:date',
    validate(availableTimeSlotsSchema),
    getAvailableTimeSlots
);

export default router;