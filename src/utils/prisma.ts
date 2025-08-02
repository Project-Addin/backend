import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
    result: {
        user: {
            photo_url: {
                needs: {
                    photo: true,
                },
                compute(data) {
                    if (data.photo) {
                        return `${process.env.URL_ASSET_PHOTO}/${data.photo}`
                    }

                    return null
                },
            }
        },
        group: {
            photo_url: {
                needs: {
                    photo: true,
                },
                compute(data) {
                    if (data.photo) {
                        return `${process.env.URL_ASSET_GROUP_PHOTO}/${data.photo}`
                    }
                },
            }
        },
        roomMessage: {
            content_url: {
                needs: {
                    content: true,
                    type: true
                },
                compute(data) {
                    if (data.type === "IMAGE") {
                        return `${process.env.URL_ASSET_ATTACH}/${data.content}`   
                    }

                    return data.content
                },
            }
        },
        groupAsset: {
            file_url: {
                needs: {
                    filename: true
                },
                compute(data) {
                    return `${process.env.URL_ASSET_GROUP}/${data.filename}`
                },
            }
        }
    }
})

export default prisma