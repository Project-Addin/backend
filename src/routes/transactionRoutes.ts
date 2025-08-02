import express from 'express'
import verifyToken, { verifyAdmin } from '../middlewares/verifyToken'
import * as transactionController from '../controllers/transactionController'
import multer from 'multer'
import { storagePhotoProof } from '../utils/multer'

const transactionRoutes = express.Router()

const uploadPhoto = multer({
    storage: storagePhotoProof,
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith('image/')) {
            callback(null, false)
        }

        callback(null, true)
    },
})

transactionRoutes.get(
    "/transactions/:id",
    transactionController.findMyTransactionById
)

transactionRoutes.post(
    "/transactions",
    verifyToken,
    transactionController.createTransaction
)

transactionRoutes.post(
    "/transactions/handle-payment",
    transactionController.updateTransaction
)

transactionRoutes.get(
    "/revenue",
    verifyToken,
    transactionController.getRevenueStat
)

transactionRoutes.get(
    "/payouts",
    verifyToken,
    transactionController.getHistoryPayouts
)

transactionRoutes.post(
    "/payouts",
    verifyToken,
    transactionController.createWithdraw
)

transactionRoutes.get(
    "/balance",
    verifyToken,
    transactionController.getBalance
)

transactionRoutes.get(
    "/admin/payouts",
    verifyToken,
    verifyAdmin,
    transactionController.getAllHistoryPayouts
)

transactionRoutes.put(
    "/admin/payouts/:id",
    verifyToken,
    verifyAdmin,
    uploadPhoto.single("proof"),
    transactionController.updateWithdraw
)

export default transactionRoutes