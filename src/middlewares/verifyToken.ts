import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/CustomRequest";
import jwt from 'jsonwebtoken'
import * as userRepositories from '../repositories/userRepositories'

export default async function verifyToken(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization

    if (authorization?.split(' ')[0] === "JWT") {
        const token = authorization.split(' ')[1]
        
        jwt.verify(token, process.env.SECRET_AUTH ?? "", async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Token Invalid"
                })
            }

            const data = decoded as {id: string}

            const user = await userRepositories.getUserById(data.id)

            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role.role
            }

            next()
        })
    } else {
        return res.status(401).json({
            success: false,
            message: "Token invalid"
        })
    }
}

export const verifyAdmin = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const user = req.user

    if (user && user.role === "ADMIN") {
        next()
    } else {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}