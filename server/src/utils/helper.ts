import env from '#config/enviroment.config.ts';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const { SECRET_KEY } = env

export const passwordHashing = async (password: string, length: number = 12) => {
    return await bcrypt.hash(password, 12);
}

export const comparePassword = async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
}

export const generateJWT = (user: { userId: string | number, email: string, name: string }) => {
    const jwtToken = jwt.sign({ user }, SECRET_KEY, {
        expiresIn: "1 hour",
    });

    return jwtToken;
};

export const verifyJWT = (token: string) => {
    const decryptedToken = jwt.verify(token, SECRET_KEY);
    return decryptedToken;
};