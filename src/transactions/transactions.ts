// @ts-nocheck

import PaymentTransaction from './PaymentTransaction.js'
import ChatTransaction from './ChatTransaction.js'
import GroupChatTransaction from './GroupChatTransaction.js'
import GroupInviteTransaction from './GroupInviteTransaction.js'
import CancelGroupInviteTransaction from './CancelGroupInviteTransaction.js'
import GroupKickTransaction from './GroupKickTransaction.js'
import GroupBanTransaction from './GroupBanTransaction.js'
import CancelGroupBanTransaction from './CancelGroupBanTransaction.js'
import CreateGroupTransaction from './CreateGroupTransaction.js'
import LeaveGroupTransaction from './LeaveGroupTransaction.js'
import JoinGroupTransaction from './JoinGroupTransaction.js'
import AddGroupAdminTransaction from './AddGroupAdminTransaction.js'
import RemoveGroupAdminTransaction from './RemoveGroupAdminTransaction.js'
import RegisterNameTransaction from './RegisterNameTransaction.js'


export const transactionTypes = {
	3: RegisterNameTransaction,
	2: PaymentTransaction,
	18: ChatTransaction,
	181: GroupChatTransaction,
	22: CreateGroupTransaction,
	24: AddGroupAdminTransaction,
	25: RemoveGroupAdminTransaction,
	26: GroupBanTransaction,
	27: CancelGroupBanTransaction,
	28: GroupKickTransaction,
	29: GroupInviteTransaction,
	30: CancelGroupInviteTransaction,
	31: JoinGroupTransaction,
	32: LeaveGroupTransaction
}


export const createTransaction = (type, keyPair, params) => {

	const tx = new transactionTypes[type]()

	tx.keyPair = keyPair
	Object.keys(params).forEach(param => {
	
		tx[param] = params[param]
	})

	return tx
}