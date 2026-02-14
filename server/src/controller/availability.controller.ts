import pool from "#db/db.ts";
import { AuthRequest } from "#middlewares/auth.middleware.ts";
import { AppError } from "#middlewares/error-handler.middleware.ts";
import { Request, Response, NextFunction } from "express";


export const createAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const client = await pool.connect()

    try {
        const { date, startTime, endTime, bookingLinkId } = req.body
        const userId = req.user!.userId;

        await client.query('BEGIN');

        const linkResult = await client.query(
            'SELECT id, user_id FROM booking_links WHERE id = $1 AND user_id = $2',
            [bookingLinkId, userId]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found or unauthorized', 404);
        }

        // Validate time range
        if (startTime >= endTime) {
            throw new AppError('End time must be after start time', 400);
        }

        const overlapCheck = await client.query(
            `SELECT id FROM availability_slots 
       WHERE booking_link_id = $1 AND date = $2 
       AND (
         (start_time <= $3 AND end_time > $3) OR
         (start_time < $4 AND end_time >= $4) OR
         (start_time >= $3 AND end_time <= $4)
       )`,
            [bookingLinkId, date, startTime, endTime]
        );

        if (overlapCheck.rows.length > 0) {
            throw new AppError('This time slot overlaps with existing availability', 409);
        }

        // Insert availability slot
        const result = await client.query(
            `INSERT INTO availability_slots 
       (user_id, booking_link_id, date, start_time, end_time) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, user_id, booking_link_id, date, start_time, end_time, created_at`,
            [userId, bookingLinkId, date, startTime, endTime]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Availability created successfully',
            availability: result.rows[0],
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}

export const getAvailabilitiesByLinkId = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { bookingLinkId } = req.params;
        const userId = req.user!.userId;

        // Verify booking link belongs to user
        const linkResult = await pool.query(
            'SELECT id FROM booking_links WHERE id = $1 AND user_id = $2',
            [bookingLinkId, userId]
        );

        if (linkResult.rows.length === 0) {
            throw new AppError('Booking link not found or unauthorized', 404);
        }

        const result = await pool.query(
            `SELECT id, date, start_time, end_time, created_at 
       FROM availability_slots 
       WHERE booking_link_id = $1 
       ORDER BY date ASC, start_time ASC`,
            [bookingLinkId]
        );

        res.json({
            availabilities: result.rows,
        });
    } catch (error) {
        next(error);
    }
}