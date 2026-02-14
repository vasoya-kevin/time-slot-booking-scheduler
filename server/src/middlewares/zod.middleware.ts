// import { Request, Response, NextFunction } from 'express';
// import { z } from 'zod';

// interface ValidateOptions {
//     body?: z.ZodTypeAny;
//     params?: z.ZodTypeAny;
//     query?: z.ZodTypeAny;
// }

// export const validate = (schemas: ValidateOptions) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             if (schemas.body) {
//                 req.body = await schemas.body.parseAsync(req.body) as any;
//             }
//             if (schemas.params) {
//                 req.params = await schemas.params.parseAsync(req.params) as any;
//             }
//             if (schemas.query) {
//                 req.query = await schemas.query.parseAsync(req.query) as any;
//             }

//             next();
//         } catch (error) {
//             if (error instanceof z.ZodError) {
//                 return res.status(400).json({
//                     success: false,
//                     errors: error.issues,
//                 });
//             }
//             next(error);
//         }
//     };

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidateOptions {
    body?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
}

export const validate = (schemas: ValidateOptions) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                await schemas.body.parseAsync(req.body);
            }
            if (schemas.params) {
                await schemas.params.parseAsync(req.params);
            }
            if (schemas.query) {
                await schemas.query.parseAsync(req.query);
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    errors: error.issues,
                });
            }
            next(error);
        }
    };