// @ts-nocheck

import PaymentTransaction from './PaymentTransaction.js'
import ChatTransaction from './ChatTransaction.js'


export const transactionTypes = {
	2: PaymentTransaction,
	18: ChatTransaction
}


export const createTransaction = (type, keyPair, params) => {
	const tx = new transactionTypes[type]()
	tx.keyPair = keyPair
	Object.keys(params).forEach(param => {
		tx[param] = params[param]
	})

	return tx
}