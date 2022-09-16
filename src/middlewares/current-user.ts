import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

interface UserPayload {
    id: string;
    email: string;
    name: string
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        return next()
    }

    try {
        const payload = jwt.verify(req.session.jwt, process.env.SECRET!) as UserPayload;
        req.user = payload
        
    } catch (error) { }
    
    next()
}