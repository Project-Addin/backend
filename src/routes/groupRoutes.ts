import express from 'express'
import multer from 'multer'
import { storageGroupPaidPhoto, storageGroupPhoto } from '../utils/multer'
import verifyToken from '../middlewares/verifyToken'
import * as groupController from '../controllers/groupController'

const groupRoutes = express.Router()

const uploadPhoto = multer({
    storage: storageGroupPhoto,
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith('image/')) {
            callback(null, false)
        }

        callback(null, true)
    },
})

const uploadPhotoPaid = multer({
    storage: storageGroupPaidPhoto,
    // fileFilter(req, file, callback) {

    //     if (file.fieldname === "assets") {
    //         callback(null, true)
    //         return
    //     }

    //     if (file.mimetype.startsWith('image/')) {
    //         callback(null, false)
    //     }

    //     callback(null, true)
    // },
})

groupRoutes.get(
    "/groups",
    verifyToken,
    groupController.getDiscoverGroups
)

groupRoutes.get(
    "/own-groups",
    verifyToken,
    groupController.getOwnGroups
)

groupRoutes.get(
    "/groups/:id",
    verifyToken,
    groupController.findDetailGroup
)

groupRoutes.get(
    "/my-groups/:id",
    verifyToken,
    groupController.findDetailMyGroup
)

groupRoutes.get(
    "/peoples",
    verifyToken,
    groupController.getDiscoverPeople
)

groupRoutes.post(
    "/groups/free",
    verifyToken,
    uploadPhoto.single('photo'),
    groupController.createFreeGroup
)

groupRoutes.put(
    "/groups/free/:groupId",
    verifyToken,
    uploadPhoto.single('photo'),
    groupController.updateFreeGroup
)

groupRoutes.post(
    "/groups/paid",
    verifyToken,
    uploadPhotoPaid.fields([{name: "photo", maxCount: 1}, {name: "assets"}]),
    groupController.createPaidGroup
)

groupRoutes.put(
    "/groups/paid/:groupId",
    verifyToken,
    uploadPhotoPaid.fields([{name: "photo", maxCount: 1}, {name: "assets"}]),
    groupController.updatePaidGroup
)

groupRoutes.post(
    "/groups/join",
    verifyToken,
    groupController.createMemberFreeGroup
)

groupRoutes.delete(
    "/groups/asset/:id",
    verifyToken,
    groupController.deleteAssetGroup
)

export default groupRoutes