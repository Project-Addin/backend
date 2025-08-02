import express from 'express'
import multer from 'multer'
import { storageUserPhoto } from '../utils/multer'
import * as userController from '../controllers/userController'
import verifyToken from '../middlewares/verifyToken'

const userRoutes = express.Router()

const uploadPhoto = multer({
    storage: storageUserPhoto,
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith('image/')) {
            callback(null, false)
        }

        callback(null, true)
    },
})

userRoutes.post(
    "/auth/sign-up",
    uploadPhoto.single('photo'),
    userController.signUp
)

userRoutes.post(
    "/auth/sign-in",
    userController.signIn
)

userRoutes.post(
    "/auth/reset-password",
    userController.getEmailReset
)
userRoutes.put(
    "/auth/reset-password/:tokenId",
    userController.updatePassword
)

userRoutes.get(
    "/user/profile/:id",
    verifyToken,
    userController.getPersonalProfile
)

export default userRoutes