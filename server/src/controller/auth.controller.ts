import { NextFunction, Request, Response } from "express";
import db from "#db/db.ts";
import { AppError } from "#middlewares/error-handler.middleware.ts";
import { comparePassword, generateJWT, passwordHashing } from "#utils/helper.ts";

/*
    Step For Register
    1. Check Body where user email password is there
    2. check in database if user already exits
    3. Hash Password stored in database
    4. Register User
    5. Login with JWT directly
*/

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        );

        if (existingUser.rows.length > 0) {
            throw new AppError("User with this email already exists", 409);
        }

        const hashPassword = await passwordHashing(password);

        const createUser = await db.query(
            "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
            [email, password, name],
        );

        const user = createUser.rows[0];

        const token = generateJWT({ userId: user.id, email: user.email });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at,
            },
        })
    } catch (error) {
        next(error);
    }
};

/*
    User Login

    1. Check email and password is there in body.
    2. check user exist in table
    3. if exist then check password
    4. password match generate jwt
*/

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await db.query('SELECT id, email, name, password_hash FROM users WHERE email=$1', [email])

        if (result.rows.length === 0) {
            throw new AppError("User is not exist.", 401)
        }

        const user = result.rows[0];

        const isValidPassword = comparePassword(password, user.password_hash)

        if (!isValidPassword) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateJWT({ userId: user.id, email: user.email })

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.log(error);
    }
};
