import pool from '#db/db.ts';
import { AppError } from '#middlewares/error-handler.middleware.ts';
import { Request, Response, NextFunction } from 'express';

export const createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const client = await pool.connect();

    try {
        const { code } = req.params;
        const { date, startTime, endTime } = req.body;

        await client.query('BEGIN');

        // Get booking link
        const linkResult = await client.query(
            'SELECT id FROM booking_links WHERE unique_code = $1 AND is_active = true',
            [code]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found', 404);
        }

        const bookingLinkId = linkResult.rows[0].id;

        // Validate date is not in the past
        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            throw new AppError('Cannot book slots in the past', 400);
        }

        // Validate time range
        if (startTime >= endTime) {
            throw new AppError('End time must be after start time', 400);
        }

        // Check if availability exists for this time slot
        const availabilityCheck = await client.query(
            `SELECT id FROM availability_slots 
       WHERE booking_link_id = $1 AND date = $2 
       AND start_time <= $3 AND end_time >= $4`,
            [bookingLinkId, date, startTime, endTime]
        );

        if (availabilityCheck.rows.length === 0) {
            throw new AppError('No availability for this time slot', 400);
        }

        // Check for conflicting bookings
        const conflictCheck = await client.query(
            `SELECT id FROM bookings 
       WHERE booking_link_id = $1 AND date = $2 
       AND (
         (start_time <= $3 AND end_time > $3) OR
         (start_time < $4 AND end_time >= $4) OR
         (start_time >= $3 AND end_time <= $4)
       )`,
            [bookingLinkId, date, startTime, endTime]
        );

        if (conflictCheck.rows.length > 0) {
            throw new AppError('This time slot is already booked', 409);
        }

        // Create booking
        const result = await client.query(
            `INSERT INTO bookings (booking_link_id, date, start_time, end_time) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, booking_link_id, date, start_time, end_time, booked_at`,
            [bookingLinkId, date, startTime, endTime]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Booking created successfully',
            booking: result.rows[0],
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

export const getBookingsByLink = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code } = req.params;

        // Get booking link
        const linkResult = await pool.query(
            'SELECT id FROM booking_links WHERE unique_code = $1',
            [code]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found', 404);
        }

        const bookingLinkId = linkResult.rows[0].id;

        const result = await pool.query(
            `SELECT id, date, start_time, end_time, booked_at 
       FROM bookings 
       WHERE booking_link_id = $1 
       ORDER BY date ASC, start_time ASC`,
            [bookingLinkId]
        );

        res.json({
            bookings: result.rows,
        });
    } catch (error) {
        next(error);
    }
};
