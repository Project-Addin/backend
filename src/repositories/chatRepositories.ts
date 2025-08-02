import prisma from "../utils/prisma"
import { CreateMessageValues } from "../utils/schema/chat"

import * as userRepositories from './userRepositories'

export const createRoomPersonal = async (sender_id: string, receiver_id: string) => {
    const room = await prisma.room.findFirst({
        where: {
            members: {
                every: {
                    user_id: {
                        in: [sender_id, receiver_id]
                    }
                }
            },
            is_group: false
        }
    })

    const owner = await userRepositories.findRole("OWNER")
    const member = await userRepositories.findRole("MEMBER")

    return await prisma.room.upsert({
        where: {
            id: room?.id ?? "0"
        },
        create: {
            created_by: sender_id,
            is_group: false,
            name: "",
            members: {
                createMany: {
                    data: [
                        {
                            user_id: sender_id,
                            role_id: owner.id

                        },
                        {
                            user_id: receiver_id,
                            role_id: member.id
                        }
                    ]
                }
            }
        },
        update: {}
    })
}

export const getRooms = async (userId: string) => {
    return await prisma.room.findMany({
        where: {
            members: {
                some: {
                    user_id: userId
                }
            }
        },
        include: {
            messages: {
                select: {
                    content: true,
                    type: true,
                    content_url: true,
                    user: {
                        select: {
                            name: true,
                            photo_url: true
                        }
                    },
                    created_at: true
                },
                take: 1,
                orderBy: {
                    created_at: "desc"
                }
            },
            members: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            photo_url: true
                        },
                    }
                },
            },
            group: {
                select: {
                    name: true,
                    photo_url: true
                }
            }
        },
        orderBy: {
            created_at: "desc"
        }
    })
}

export const getRoomMessages = async (roomId: string) => {
    return await prisma.room.findFirst({
        where: {
            id: roomId
        },
        select: {
            id: true,
            is_group: true,
            messages: {
                select: {
                    content: true,
                    type: true,
                    content_url: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            photo_url: true
                        }
                    },
                    created_at: true
                },
                orderBy: {
                    created_at: "asc"
                }
            },
            group: {
                select: {
                    name: true,
                    about: true,
                    photo_url: true,
                    type: true,
                    assets: true,
                    benefit: true,
                    room: {
                        select: {
                            _count: {
                                select: {
                                    members: true
                                }
                            }
                        }
                    }
                }
            },
            members: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            photo_url: true,
                            created_at: true
                        }
                    },
                    role: {
                        select: {
                            role: true
                        }
                    },
                    joined_at: true
                }
            }
        }
    })
}

export const findRoomById = async (room_id: string) => {
    return await prisma.room.findFirstOrThrow({
        where: {
            id: room_id
        }
    })
}

export const findMember = async (userId: string, roomId: string) => {
    return await prisma.roomMember.findFirst({
        where: {
            room_id: roomId,
            user_id: userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    photo_url: true
                }
            }
        }
    })
}

export const createMessage = async (data: CreateMessageValues, userId: string, file: Express.Multer.File | undefined) => {
    return await prisma.roomMessage.create({
        data: {
            sender_id: userId,
            room_id: data.room_id,
            content: file ? file.filename : data.message,
            type: file ? "IMAGE" : "TEXT"
        }
    })
}