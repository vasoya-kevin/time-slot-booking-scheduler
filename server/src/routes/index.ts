import { Router } from "express";

import authRouter from "./auth.routes.ts";
import availabilityRouter from "./availability.routes.ts";
import bookingLinksRouter from "./booking-link.routes.ts";
import bookingRouter from "./bookings.routes.ts";

const router = Router();

router.use('/auth', authRouter);
router.use('/availability', availabilityRouter);
router.use('/booking-links', bookingLinksRouter);
router.use('/bookings', bookingRouter);

export default router