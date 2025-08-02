import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/CustomRequest";
import { groupFreeSchema, groupPaidSchema, joinFreeGroup } from "../utils/schema/group";

import * as groupService from '../services/groupService'

export const getDiscoverGroups = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const {name} = req.query

        const data = await groupService.getDiscoverGroups(name as string ?? "")

        return res.json({
            success: true,
            message: "Get discover groups success",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getOwnGroups = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const data = await groupService.getMyOwnGroups(req.user?.id ?? "")

        return res.json({
            success: true,
            message: "Get my own groups success",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const getDiscoverPeople = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {name} = req.query

        const data = await groupService.getDiscoverPeoples(name as string ?? "", req?.user?.id)

        return res.json({
            success: true,
            message: "Get discover groups success",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const findDetailGroup = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params

        const data = await groupService.findDetailGroup(id)

        return res.json({
            success: true,
            message: "Get detail group success",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const findDetailMyGroup = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params

        const data = await groupService.findDetailMyGroup(id, req?.user?.id ?? "")

        return res.json({
            success: true,
            message: "Get detail group success",
            data
        })
    } catch (error) {
        next(error)
    }
}

export const createFreeGroup = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const parse = groupFreeSchema.safeParse(req.body)
        
         if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: true,
                message: "File photo is required"
            })
        }

        const group = await groupService.upsertFreeGroup(parse.data, req?.user?.id ?? "", req.file.filename)

        return res.json({
            success: true,
            message: "Update group success",
            data: group
        })
    } catch (error) {
        next(error)
    }
}

export const updateFreeGroup = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {

        const {groupId} = req.params

        const parse = groupFreeSchema.safeParse(req.body)
        
         if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const group = await groupService.upsertFreeGroup(parse.data, req?.user?.id ?? "", req?.file?.filename, groupId)

        return res.json({
            success: true,
            message: "Create group success",
            data: group
        })
    } catch (error) {
        next(error)
    }
}

export const createPaidGroup = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const parse = groupPaidSchema.safeParse(req.body)
        
         if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const file = req.files as {photo?: Express.Multer.File[], assets?: Express.Multer.File[]}

        if (!file.photo) {
            return res.status(400).json({
                success: true,
                message: "File photo is required"
            })
        }

        if (!file.assets) {
            return res.status(400).json({
                success: true,
                message: "File asset is required"
            })
        }

        const assets = file.assets.map((file) => file.filename)

        const group = await groupService.upsertPaidGroup(parse.data, req?.user?.id ?? "", file.photo[0].filename, assets)

        return res.json({
            success: true,
            message: "Create group success",
            data: group
        })

    } catch (error) {
        next(error)
    }
}

export const updatePaidGroup = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const {groupId} = req.params

        const parse = groupPaidSchema.safeParse(req.body)
        
         if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => `${err.path} - ${err.message}`)

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                detail: errorMessage
            })
        }

        const file = req.files as {photo?: Express.Multer.File[], assets?: Express.Multer.File[]}


        const assets = file?.assets?.map((file) => file.filename)

        const group = await groupService.upsertPaidGroup(parse.data, req?.user?.id ?? "", file?.photo?.[0].filename, assets, groupId)

        return res.json({
            success: true,
            message: "Create group success",
            data: group
        })

    } catch (error) {
        next(error)
    }
}

export const createMemberFreeGroup = async (
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

       const data = await groupService.addMemberFreeGroup(parse.data.group_id, req?.user?.id ?? "")

       return res.json({
        success: true,
        message: "Success join group",
        data
       })
    } catch (error) {
        next(error)
    }
}

export const deleteAssetGroup = async (
    req: CustomRequest,
        res: Response,
        next: NextFunction
) => {
    try {
        const {id} = req.params

       const data = await groupService.deleteGroupAsset(id)

       return res.json({
        success: true,
        message: "Success delete asset group",
        data
       })
    } catch (error) {
        next(error)
    }
}