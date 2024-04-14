// @ts-nocheck

import PaymentTransaction from './PaymentTransaction.js'


export const transactionTypes = {
	2: PaymentTransaction,
	
}


export const createTransaction = (type, keyPair, params) => {
	const tx = new transactionTypes[type]()
	tx.keyPair = keyPair
	Object.keys(params).forEach(param => {
		tx[param] = params[param]
	})

	return tx
}