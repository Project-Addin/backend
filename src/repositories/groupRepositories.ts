import prisma from "../utils/prisma";
import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as userRepositories from "./userRepositories";

export const findGroupById = async (id: string) => {
	return await prisma.group.findFirstOrThrow({
		where: {
			id,
		},
		include: {
			room: {
				select: {
					members: {
						include: {
							role: true,
						},
						where: {
							role: {
								role: "OWNER",
							},
						},
					},
				},
			},
		},
	});
};

export const getDiscoverGroups = async (name = "") => {
	return await prisma.group.findMany({
		where: {
			name: {
				contains: name,
				mode: "insensitive",
			},
		},
		select: {
			photo_url: true,
			id: true,
			name: true,
			about: true,
			type: true,
			room: {
				select: {
					_count: {
						select: {
							members: true,
						},
					},
				},
			},
		},
	});
};

export const getDiscoverPeople = async (name = "", userId?: string) => {
	return await prisma.user.findMany({
		where: {
			id: {
				not: userId,
			},
			name: {
				contains: name,
				mode: "insensitive",
			},
		},
		select: {
			id: true,
			name: true,
			photo_url: true,
			created_at: true,
		},
	});
};

export const upsertFreeGroup = async (
	data: GroupFreeValues,
	userId: string,
	photo?: string,
	groupId?: string
) => {
	const owner = await userRepositories.findRole("OWNER");

	return await prisma.group.upsert({
		where: {
			id: groupId ?? "",
		},
		create: {
			photo: photo ?? "",
			name: data.name,
			about: data.about,
			price: 0,
			type: "FREE",
			room: {
				create: {
					created_by: userId,
					name: data.name,
					members: {
						create: {
							user_id: userId,
							role_id: owner.id,
						},
					},
					is_group: true,
				},
			},
		},
		update: {
			photo: photo,
			name: data.name,
			about: data.about,
		},
	});
};

export const upsertPaidGroup = async (
	data: GroupPaidValues,
	userId: string,
	photo?: string,
	assets?: string[],
	groupId?: string
) => {
	const owner = await userRepositories.findRole("OWNER");

	const group = await prisma.group.upsert({
		where: {
			id: groupId ?? "",
		},
		create: {
			photo: photo ?? "",
			name: data.name,
			about: data.about,
			price: Number.parseInt(data.price),
			benefit: data.benefit,
			type: "PAID",
			room: {
				create: {
					created_by: userId,
					name: data.name,
					members: {
						create: {
							user_id: userId,
							role_id: owner.id,
						},
					},
					is_group: true,
				},
			},
		},
		update: {
			photo: photo,
			name: data.name,
			about: data.about,
			price: Number.parseInt(data.price),
			benefit: data.benefit,
			type: "PAID",
		},
	});

	if (assets) {
		for (const asset of assets) {
			await prisma.groupAsset.create({
				data: {
					filename: asset,
					group_id: group.id,
				},
			});
		}
	}

	return group;
};

export const findDetailGroup = async (id: string, userId?: string) => {
	return await prisma.group.findFirstOrThrow({
		where: {
			id: id,
			...(userId !== undefined
				? {
						room: {
							created_by: userId,
						},
				  }
				: {}),
		},
		select: {
			id: true,
			name: true,
			photo_url: true,
			about: true,
			type: true,
			price: true,
			assets: {
				select: {
					id: true,
					filename: true,
					...(userId !== undefined ? { file_url: true } : {}),
				},
			},
			benefit: true,
			room: {
				select: {
					members: {
						...(userId === undefined
							? {
									take: 1,
									where: {
										role: {
											role: "OWNER",
										},
									},
							  }
							: {}),
						select: {
							user: {
								select: {
									name: true,
									photo_url: true,
								},
							},
							joined_at: true,
							role: {
								select: {
									role: true
								}
							}
						},
					},
					_count: {
						select: {
							members: true,
						},
					},
				},
			},
		},
	});
};

export const getMyOwnGroups = async (userId: string) => {
	return await prisma.group.findMany({
		where: {
			room: {
				created_by: userId,
			},
		},
		select: {
			id: true,
			photo_url: true,
			name: true,
			type: true,
			room: {
				select: {
					_count: {
						select: {
							members: true,
						},
					},
					id: true,
				},
			},
		},
	});
};

export const getTotalMembers = async (roomIds: string[]) => {
	return await prisma.roomMember.count({
		where: {
			room_id: {
				in: roomIds,
			},
		},
	});
};

export const getMemberById = async (userId: string, groupId: string) => {
	return await prisma.roomMember.findFirst({
		where: {
			user_id: userId,
			room: {
				group: {
					id: groupId,
				},
			},
		},
	});
};

export const addMemberToGroup = async (roomId: string, userId: string) => {
	const role = await userRepositories.findRole("MEMBER");

	return await prisma.roomMember.create({
		data: {
			room_id: roomId,
			user_id: userId,
			role_id: role.id,
		},
	});
};

export const findAssetGroup = async (assetId: string) => {
	return await prisma.groupAsset.findFirstOrThrow({
		where: {
			id: assetId,
		},
	});
};

export const deleteAssetGroup = async (assetId: string) => {
	return await prisma.groupAsset.delete({
		where: {
			id: assetId,
		},
	});
};
