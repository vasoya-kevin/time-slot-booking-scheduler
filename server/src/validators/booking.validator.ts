import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createBookingSchema = {
    body: z
        .object({
            date: z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: 'Valid date is required (YYYY-MM-DD format)',
                })
                .refine((val) => {
                    const inputDate = new Date(val).toISOString().split('T')[0];
                    const today = new Date().toISOString().split('T')[0];
                    return inputDate >= today;
                }, {
                    message: 'Date cannot be in the past',
                }),
            startTime: z
                .string()
                .regex(timeRegex, 'Valid start time is required (HH:MM:SS format)'),
            endTime: z
                .string()
                .regex(timeRegex, 'Valid end time is required (HH:MM:SS format)'),
        })
        .refine((data) => data.endTime > data.startTime, {
            message: 'End time must be after start time',
            path: ['endTime'],
        }),
    params: z.object({
        code: z.string().min(1, 'Booking code is required'),
    }),
    query: z.object({}),
};

export const getBookingsByCodeSchema = {
    body: z.object({}),
    params: z.object({
        code: z.string().min(1, 'Booking code is required'),
    }),
    query: z.object({}),
};