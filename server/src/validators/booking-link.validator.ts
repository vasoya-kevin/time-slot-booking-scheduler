import { z } from 'zod';

export const bookingLinkCodeSchema = {
    body: z.object({}),
    params: z.object({
        code: z.string().min(1, 'Booking code is required'),
    }),
    query: z.object({}),
};

export const availableTimeSlotsSchema = {
    body: z.object({}),
    params: z.object({
        code: z.string().min(1, 'Booking code is required'),
        date: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Valid date is required',
            }),
    }),
    query: z.object({}),
};