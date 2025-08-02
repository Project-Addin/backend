import { NextFunction, Response } from "express"
import { CustomRequest } from "../types/CustomRequest"
import { joinFreeGroup } from "../utils/schema/group"
import * as transactionService from '../services/transactionService'
import { withdrawSchema } from "../utils/schema/transaction"

export const findMyTransactionById = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params
        const data = await transactionService.findTransactionById(id)

        return res.json({
            success: true,
            message: "Success get transaction",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const createTransaction = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const parse = joinFreeGroup.safeParse(req.body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const data = await transactionService.createTransaction(parse.data.group_id, req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success create transaction",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const updateTransaction = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await transactionService.updateTransaction(req.body.order_id, req.body.transaction_status)

        return res.json({
            success: true,
            message: "Success update transaction",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getRevenueStat = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await transactionService.getRevenueStat(req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success get revenue stat",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getHistoryPayouts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await transactionService.getHistoryPayouts(req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success get history payouts",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getBalance = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await transactionService.getBalance(req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success get balance",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const createWithdraw = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const parse = withdrawSchema.safeParse(req.body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const data = await transactionService.createWithdraw(parse.data, req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Success create withdraw",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getAllHistoryPayouts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = await transactionService.getAllHistoryPayouts()

        return res.json({
            success: true,
            message: "Success get history payouts",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const updateWithdraw = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params


        if (!req.file) {
            return res.status(400).json({
                message: "Proof is required",
                data: null
            })
        }

        const data = await transactionService.updateWithdraw(id, req.file)

        return res.json({
            success: true,
            message: "Success update withdraw",
            data
        })
    } catch (error) {
        next(error)
    }
}