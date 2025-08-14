import express from 'express'
import * as chatController from '../controllers/chatController'
import verifyToken from '../middlewares/verifyToken'
import multer from 'multer'
import { storagePhotoAttach } from '../utils/multer'


const chatRoutes = express.Router()

const uploadAttach = multer({
    storage: storagePhotoAttach,
    fileFilter(req, file, callback) {
        if (file.mimetype.startsWith("image")) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
})

// Define routes for chat functionality
chatRoutes.get(
    "/chat/rooms",
    verifyToken,
    chatController.getRooms
)

chatRoutes.get(
    "/chat/rooms/:roomId",
    verifyToken,
    chatController.getRoomMessages
)

chatRoutes.post(
    "/chat/rooms",
    verifyToken,
    chatController.createRoomPersonal
)

chatRoutes.post(
    "/chat/rooms/messages",
    verifyToken,
    uploadAttach.single('attach'),
    chatController.createMessage
)

export default chatRoutes