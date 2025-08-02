import * as chatRepo from "../repositories/chatRepositories";
import { CreateMessageValues } from "../utils/schema/chat";
import path from "node:path";
import fs from "node:fs";
import pusher from "../utils/pusher";

export const createRoomPersonal = async (
	sender_id: string,
	receiver_id: string
) => {
	return await chatRepo.createRoomPersonal(sender_id, receiver_id);
};

export const getRecentRooms = async (userId: string) => {
	return await chatRepo.getRooms(userId);
};

export const getRoomMessages = async (roomId: string) => {
	return await chatRepo.getRoomMessages(roomId);
};

export const createMessage = async (
	data: CreateMessageValues,
	userId: string,
	file: Express.Multer.File | undefined
) => {
	const room = await chatRepo.findRoomById(data.room_id);

	const member = await chatRepo.findMember(userId, room.id);

	if (!member) {
		const pathFile = path.join(
			__dirname,
			"../../public/assets/uploads/attach_messages/",
			file?.filename ?? ""
		);

		if (fs.existsSync(pathFile)) {
			fs.unlinkSync(pathFile);
		}

		throw new Error("You are not a member of this group");
	}

    const channelName = `chat-room-${data.room_id}`;
    const eventName = `chat-room-${data.room_id}-event`;

    pusher.trigger(channelName, eventName, {
        content: file ? `${process.env.URL_ASSET_ATTACH}/${file.filename}` : data.message,
        content_url: file ? `${process.env.URL_ASSET_ATTACH}/${file.filename}` : null,
        user: {
            id: member.user.id,
            name: member.user.name,
            photo_url: member.user.photo_url
        },
        type: file ? "IMAGE" : "TEXT",
        created_at: new Date()
    })

	return await chatRepo.createMessage(data, userId, file);
};
