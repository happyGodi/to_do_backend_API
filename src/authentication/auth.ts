import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request{
    token: String | JwtPayload
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '')

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, `${process.env.secretToken}`);
        (req as CustomRequest).token = decoded

        next();
    } catch (e: any) {
       return res.status(401).json(e.message);
    }
}

export default auth