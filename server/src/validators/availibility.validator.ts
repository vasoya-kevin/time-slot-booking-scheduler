import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createAvailabilitySchema = {
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
            bookingLinkId: z.coerce
                .number()
                .int()
                .positive('Valid booking link ID is required'),
        })
        .refine((data) => data.endTime > data.startTime, {
            message: 'End time must be after start time',
            path: ['endTime'],
        }),
    params: z.object({}),
    query: z.object({}),
};


export const availabilityLinkIdSchema = {
    body: z.object({}),
    params: z.object({
        bookingLinkId: z.coerce
            .number()
            .int()
            .positive('Valid booking link ID is required'),
    }),
    query: z.object({}),
};