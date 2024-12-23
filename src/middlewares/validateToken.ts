import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

interface UserPayload {
    user: {
        id: string;
        [key: string]: any;
    }
}

interface AuthRequest extends Request {
    user?: UserPayload['user'];
}

const validateToken = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];

        verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'User is not authorized' });
                return;
            }

            req.user = (decoded as UserPayload).user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization denied' });
    }
});

export { validateToken };