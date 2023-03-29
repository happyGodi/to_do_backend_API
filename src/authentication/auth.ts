import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request{
    token: String | JwtPayload
}

async function auth(req: Request, res: Response, next: NextFunction){
    try {
        const token = req.header('Authorization')?.replace('Bearer', '')

        if (!token) {
            throw new Error();
        }

        const decode = jwt.verify(token, `${process.env.secretToken}`);
        (req as CustomRequest).token = decode

        next();
    } catch (e) {
        res.status(401).send('Please authenticate');
    }
}

export default auth