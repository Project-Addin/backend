import * as groupRepositories from "../repositories/groupRepositories";
import * as transactionRepositories from "../repositories/transactionRepositories";
import * as userRepositories from "../repositories/userRepositories";
import { WithdrawValues } from "../utils/schema/transaction";
import dayjs from 'dayjs'

export const findTransactionById = async (id: string) => {
	return await transactionRepositories.findTransactionById(id)
}

export const createTransaction = async (groupId: string, userId: string) => {
	const checkMember = await groupRepositories.getMemberById(userId, groupId);

	if (checkMember) {
		throw new Error("You already joined group");
	}

	const group = await groupRepositories.findGroupById(groupId);

	if (group.type === "FREE") {
		throw new Error("This group is free");
	}

	const user = await userRepositories.getUserById(userId);

	const transaction = await transactionRepositories.createTransaction({
		price: group.price,
		owner: {
			connect: {
				id: group.room.members[0].user_id,
			},
		},
		user: {
			connect: {
				id: userId,
			},
		},
		type: "PENDING",
		group: {
			connect: {
				id: groupId,
			},
		},
	});

	const midtransUrl = process.env.MIDTRANS_TRANSACTION_URL ?? "";
	const midtransAuth = process.env.MIDTRANS_AUTH_STRING ?? "";

	const midtransResponse = await fetch(midtransUrl, {
		method: "POST",
		body: JSON.stringify({
			transaction_details: {
				order_id: transaction.id,
				gross_amount: transaction.price,
			},
			credit_card: {
				secure: true,
			},
			customer_details: {
				email: user.email,
			},
			callbacks: {
				finish: process.env.SUCCESS_TRANSACTION_URL
			}
		}),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Basic ${midtransAuth}`,
		},
	});
	const midtransJson = await midtransResponse.json();

	return midtransJson;
};

export const updateTransaction = async (order_id: string, status: string) => {
	switch (status) {
		case "capture":
		case "settlement": {
			const transaction = await transactionRepositories.updateTransaction(
				order_id,
				"SUCCESS"
			);
			const group = await groupRepositories.findGroupById(
				transaction.group_id
			);

			await groupRepositories.addMemberToGroup(
				group.room_id,
				transaction.user_id
			);

			return {
                transaction_id: transaction.id
            };
		}

		case "deny":
		case "expire":
		case "failure": {
			const transaction = await transactionRepositories.updateTransaction(
				order_id,
				"FAILED"
			);

			return {
                transaction_id: transaction.id
            };
		}

		default:
			return {};
	}
};

export const getBalance = async (user_id: string) => {
	const transactions = await transactionRepositories.getMyTransactions(user_id)
	const payouts = await transactionRepositories.getMyPayouts(user_id)

	const totalRevenue = transactions.reduce((acc, curr) => {
		if (curr.type === "SUCCESS") {
			return acc + curr.price
		}

		return acc
	}, 0)

	const totalPayout = payouts.reduce((acc, curr) => {
		if (curr.status === "SUCCESS") {
			return acc + curr.amount
		}

		return acc
	}, 0)

	return totalRevenue - totalPayout
}

export const getRevenueStat = async (user_id: string) => {
	const transactions = await transactionRepositories.getMyTransactions(user_id)
	const payouts = await transactionRepositories.getMyPayouts(user_id)
	const groups = await groupRepositories.getMyOwnGroups(user_id)

	const totalRevenue = transactions.reduce((acc, curr) => {
		if (curr.type === "SUCCESS") {
			return acc + curr.price
		}

		return acc
	}, 0)

	const last8Months = Array.from({length: 8}, (_, i) => dayjs().subtract(i, "month"),).reverse()

	const transactionsPerMonths = last8Months.reduce<Record<string, number>>(
		(acc, date) => {
			const trxMonth = transactions.filter((trx) => dayjs(date).isSame(dayjs(trx.created_at), "M")).filter((trx) => trx.type === "SUCCESS")

			const totalTrxMonth = trxMonth.reduce((acc, trx) => acc + trx.price, 0)

			if (acc[date.format("MMM")]) {
				acc[date.format("MMM")] = 0
			}

			acc[date.format("MMM")] = totalTrxMonth

			return acc
		},
		{}
	)

	const totalPayout = payouts.reduce((acc, curr) => {
		if (curr.status === "SUCCESS") {
			return acc + curr.amount
		}

		return acc
	}, 0)
	const balance = totalRevenue - totalPayout

	const totalVipGroups = groups.filter((group) => group.type === "PAID").length
	const totalVipMembers = groups.reduce((acc, curr) => {
		if (curr.type === "PAID") {
			return acc + (curr?.room?._count?.members ?? 0)
		}

		return acc
	}, 0)

	const latestMembersVip = transactions.filter((transaction) => transaction.type === "SUCCESS")

	return {
		balance,
		total_vip_groups: totalVipGroups,
		total_vip_members: totalVipMembers,
		total_revenue: totalRevenue,
		latest_members: latestMembersVip,
		transactionsPerMonths
	}
	
}

export const getHistoryPayouts = async (user_id: string) => {
	return await transactionRepositories.getMyPayouts(user_id)
}

export const getAllHistoryPayouts = async () => {
	return await transactionRepositories.getAllPayouts()
}

export const createWithdraw = async (data: WithdrawValues, user_id: string) => {
	const balance = await getBalance(user_id)

	if (balance < data.amount) {
		throw new Error("Failed to create withdraw: Insufficient balance")
	}

	return await transactionRepositories.createWithdraw(data, user_id)
}

export const updateWithdraw = async (id: string, file: Express.Multer.File) => {
	console.log(id);

	return await transactionRepositories.updateWithdraw(id, "SUCCESS", file.filename)
}