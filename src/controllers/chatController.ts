import { NextFunction, Response } from "express"
import { CustomRequest } from "../types/CustomRequest"

import * as chatService from '../services/chatService'
import { createMessageSchema, createRoomPersonalSchema } from "../utils/schema/chat"

export const createRoomPersonal = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const parse = createRoomPersonalSchema.safeParse(req.body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const data = await chatService.createRoomPersonal(req?.user?.id ?? "", parse.data.user_id)

        return res.json({
            success: true,
            message: "Success create room",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getRooms = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await chatService.getRecentRooms(req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success get rooms",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getRoomMessages = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {roomId} = req.params
        const data = await chatService.getRoomMessages(roomId)

        return res.json({
            success: true,
            message: "Success get room messages",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const createMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const parse = createMessageSchema.safeParse(req.body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const data = await chatService.createMessage(parse.data, req?.user?.id ?? "", req?.file)

        return res.json({
            success: true,
            message: "Success create message",
            data
        })
    } catch (error) {
        next(error)
    }
}