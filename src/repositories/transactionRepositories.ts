import { Prisma, TransactionType } from "@prisma/client";
import prisma from "../utils/prisma";
import { WithdrawValues } from "../utils/schema/transaction";

export const findTransactionById = async (id: string) => {
	return await prisma.transaction.findFirstOrThrow({
		where: {
			id,
		},
		select: {
			created_at: true,
			price: true,
			type: true,
			group: {
				select: {
					photo_url: true,
					name: true,
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
			},
		},
	});
};

export const createTransaction = async (
	data: Prisma.TransactionCreateInput
) => {
	return await prisma.transaction.create({
		data,
	});
};

export const updateTransaction = async (id: string, type: TransactionType) => {
	return await prisma.transaction.update({
		where: {
			id,
		},
		data: {
			type,
		},
	});
};

export const getMyTransactions = async (user_id: string) => {
	return await prisma.transaction.findMany({
		where: {
			owner_id: user_id,
		},
		include: {
			user: {
				select: {
					name: true,
					photo_url: true,
				},
			},
			group: {
				select: {
					name: true,
					photo_url: true,
				},
			},
		},
	});
};

export const getMyPayouts = async (user_id: string) => {
	return await prisma.payout.findMany({
		where: {
			user_id,
		},
		orderBy: {
			created_at: "desc",
		},
	});
};

export const getAllPayouts = async () => {
	return await prisma.payout.findMany({
		orderBy: {
			created_at: "desc",
		},
	});
};

export const createWithdraw = async (data: WithdrawValues, user_id: string) => {
	return await prisma.payout.create({
		data: {
			amount: data.amount,
			bank_name: data.bank_name,
			bank_account_name: data.bank_account_name,
			bank_account_number: data.bank_account_number.toString(),
			user_id: user_id,
			status: "PENDING",
		},
	});
};

export const updateWithdraw = async (
	id: string,
	status: TransactionType,
	filename: string
) => {
	return await prisma.payout.update({
		where: {
			id: id,
		},
		data: {
			status: status,
			proof: filename,
		},
	});
};
