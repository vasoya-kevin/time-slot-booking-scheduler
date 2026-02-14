import pool from '#db/db.ts';
import { AuthRequest } from '#middlewares/auth.middleware.ts';
import { AppError } from '#middlewares/error-handler.middleware.ts';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const generateBookingLink = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;

        // Generate unique code
        const uniqueCode = uuidv4().split('-')[0]; // Use first segment for shorter URL

        const result = await pool.query(
            `INSERT INTO booking_links (user_id, unique_code) 
       VALUES ($1, $2) 
       RETURNING id, user_id, unique_code, created_at, is_active`,
            [userId, uniqueCode]
        );

        const bookingLink = result.rows[0];

        res.status(201).json({
            message: 'Booking link generated successfully',
            bookingLink: {
                id: bookingLink.id,
                uniqueCode: bookingLink.unique_code,
                url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/book/${bookingLink.unique_code}`,
                createdAt: bookingLink.created_at,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getBookingLinkByCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code } = req.params;

        const result = await pool.query(
            `SELECT bl.id, bl.unique_code, bl.created_at, u.name as user_name
       FROM booking_links bl
       JOIN users u ON bl.user_id = u.id
       WHERE bl.unique_code = $1 AND bl.is_active = true`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new AppError('Booking link not found', 404);
        }

        res.json({
            bookingLink: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableDates = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code } = req.params;

        // Get booking link
        const linkResult = await pool.query(
            'SELECT id FROM booking_links WHERE unique_code = $1 AND is_active = true',
            [code]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found', 404);
        }

        const bookingLinkId = linkResult.rows[0].id;

        // Get all future dates with availability
        const result = await pool.query(
            `SELECT DISTINCT date 
       FROM availability_slots 
       WHERE booking_link_id = $1 AND date >= CURRENT_DATE
       ORDER BY date ASC`,
            [bookingLinkId]
        );

        res.json({
            dates: result.rows.map(row => row.date),
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableTimeSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code, date } = req.params;

        // Get booking link
        const linkResult = await pool.query(
            'SELECT id FROM booking_links WHERE unique_code = $1 AND is_active = true',
            [code]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found', 404);
        }

        const bookingLinkId = linkResult.rows[0].id;

        // Get availability for the date
        const availabilityResult = await pool.query(
            `SELECT start_time, end_time 
       FROM availability_slots 
       WHERE booking_link_id = $1 AND date = $2`,
            [bookingLinkId, date]
        );

        if (availabilityResult.rows.length === 0) {
            return res.json({ timeSlots: [] });
        }

        // Get all bookings for the date
        const bookingsResult = await pool.query(
            `SELECT start_time, end_time 
       FROM bookings 
       WHERE booking_link_id = $1 AND date = $2`,
            [bookingLinkId, date]
        );

        const bookedSlots = bookingsResult.rows;

        // Generate 30-minute time slots from availability
        const timeSlots = [];
        const slotDuration = 30; // minutes

        for (const availability of availabilityResult.rows) {
            let currentTime = parseTime(availability.start_time);
            const endTime = parseTime(availability.end_time);

            while (currentTime + slotDuration <= endTime) {
                const slotStart = formatTime(currentTime);
                const slotEnd = formatTime(currentTime + slotDuration);

                // Check if slot is already booked
                const isBooked = bookedSlots.some(booking => {
                    const bookingStart = parseTime(booking.start_time);
                    const bookingEnd = parseTime(booking.end_time);
                    const currentSlotEnd = currentTime + slotDuration;

                    // Check for overlap
                    return (
                        (currentTime >= bookingStart && currentTime < bookingEnd) ||
                        (currentSlotEnd > bookingStart && currentSlotEnd <= bookingEnd) ||
                        (currentTime <= bookingStart && currentSlotEnd >= bookingEnd)
                    );
                });

                if (!isBooked) {
                    timeSlots.push({
                        startTime: slotStart,
                        endTime: slotEnd,
                    });
                }

                currentTime += slotDuration;
            }
        }

        res.json({ timeSlots });
    } catch (error) {
        next(error);
    }
};

// Helper functions to convert time strings to minutes and back
function parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
}

export const getUserBookingLinks = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.userId;

        const result = await pool.query(
            `SELECT id, unique_code, created_at, is_active 
       FROM booking_links 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            bookingLinks: result.rows.map(link => ({
                id: link.id,
                uniqueCode: link.unique_code,
                url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/book/${link.unique_code}`,
                createdAt: link.created_at,
                isActive: link.is_active,
            })),
        });
    } catch (error) {
        next(error);
    }
};
