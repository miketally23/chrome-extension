// @ts-nocheck

import Base58 from "../../deps/Base58"
import ed2curve from "../../deps/ed2curve"
import nacl from "../../deps/nacl-fast"


export function base64ToUint8Array(base64: string) {
	const binaryString = atob(base64)
	const len = binaryString.length
	const bytes = new Uint8Array(len)
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}
	return bytes
}

export function uint8ArrayToBase64(uint8Array: any) {
	const length = uint8Array.length
	let binaryString = ''
	const chunkSize = 1024 * 1024; // Process 1MB at a time
	for (let i = 0; i < length; i += chunkSize) {
		const chunkEnd = Math.min(i + chunkSize, length)
		const chunk = uint8Array.subarray(i, chunkEnd)
		binaryString += Array.from(chunk, byte => String.fromCharCode(byte)).join('')
	}
	return btoa(binaryString)
}

export function objectToBase64(obj: Object) {
	// Step 1: Convert the object to a JSON string
	const jsonString = JSON.stringify(obj)
	// Step 2: Create a Blob from the JSON string
	const blob = new Blob([jsonString], { type: 'application/json' })
	// Step 3: Create a FileReader to read the Blob as a base64-encoded string
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				// Remove 'data:application/json;base64,' prefix
				const base64 = reader.result.replace(
					'data:application/json;base64,',
					''
				)
				resolve(base64)
			} else {
				reject(new Error('Failed to read the Blob as a base64-encoded string'))
			}
		}
		reader.onerror = () => {
			reject(reader.error)
		}
		reader.readAsDataURL(blob)
	})
}

// Function to create a symmetric key and nonce
export const createSymmetricKeyAndNonce = () => {
    const messageKey = new Uint8Array(32); // 32 bytes for the symmetric key
    crypto.getRandomValues(messageKey);

    const nonce = new Uint8Array(24); // 24 bytes for the nonce
    crypto.getRandomValues(nonce);

    return { messageKey: uint8ArrayToBase64(messageKey), nonce: uint8ArrayToBase64(nonce) };
};


export const encryptDataGroup = ({ data64, publicKeys, privateKey, userPublicKey }: any) => {

	let combinedPublicKeys = publicKeys
	const decodedPrivateKey = Base58.decode(privateKey)
	const publicKeysDuplicateFree = [...new Set(combinedPublicKeys)]

	const Uint8ArrayData = base64ToUint8Array(data64)
	if (!(Uint8ArrayData instanceof Uint8Array)) {
		throw new Error("The Uint8ArrayData you've submitted is invalid")
	}
	try {
		// Generate a random symmetric key for the message.
		const messageKey = new Uint8Array(32)
		crypto.getRandomValues(messageKey)
		const nonce = new Uint8Array(24)
		crypto.getRandomValues(nonce)
		// Encrypt the data with the symmetric key.
		const encryptedData = nacl.secretbox(Uint8ArrayData, nonce, messageKey)
		// Generate a keyNonce outside of the loop.
		const keyNonce = new Uint8Array(24)
		crypto.getRandomValues(keyNonce)
		// Encrypt the symmetric key for each recipient.
		let encryptedKeys = []
		publicKeysDuplicateFree.forEach((recipientPublicKey) => {
			const publicKeyUnit8Array = Base58.decode(recipientPublicKey)
			const convertedPrivateKey = ed2curve.convertSecretKey(decodedPrivateKey)
			const convertedPublicKey = ed2curve.convertPublicKey(publicKeyUnit8Array)
			const sharedSecret = new Uint8Array(32)

			// the length of the sharedSecret will be 32 + 16
			// When you're encrypting data using nacl.secretbox, it's adding an authentication tag to the result, which is 16 bytes long. This tag is used for verifying the integrity and authenticity of the data when it is decrypted
			nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedPublicKey)

			// Encrypt the symmetric key with the shared secret.
			const encryptedKey = nacl.secretbox(messageKey, keyNonce, sharedSecret)

			encryptedKeys.push(encryptedKey)
		})
		const str = "qortalGroupEncryptedData"
		const strEncoder = new TextEncoder()
		const strUint8Array = strEncoder.encode(str)
		// Convert sender's public key to Uint8Array and add to the message
		const senderPublicKeyUint8Array = Base58.decode(userPublicKey)
		// Combine all data into a single Uint8Array.
		// Calculate size of combinedData
		let combinedDataSize = strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length + encryptedData.length + 4
		let encryptedKeysSize = 0
		encryptedKeys.forEach((key) => {
			encryptedKeysSize += key.length
		})
		combinedDataSize += encryptedKeysSize
		let combinedData = new Uint8Array(combinedDataSize)
		combinedData.set(strUint8Array)
		combinedData.set(nonce, strUint8Array.length)
		combinedData.set(keyNonce, strUint8Array.length + nonce.length)
		combinedData.set(senderPublicKeyUint8Array, strUint8Array.length + nonce.length + keyNonce.length)
		combinedData.set(encryptedData, strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length)
		// Initialize offset for encryptedKeys
		let encryptedKeysOffset = strUint8Array.length + nonce.length + keyNonce.length + senderPublicKeyUint8Array.length + encryptedData.length
		encryptedKeys.forEach((key) => {
			combinedData.set(key, encryptedKeysOffset)
			encryptedKeysOffset += key.length
		})
		const countArray = new Uint8Array(new Uint32Array([publicKeysDuplicateFree.length]).buffer)
		combinedData.set(countArray, combinedData.length - 4)
		return uint8ArrayToBase64(combinedData)
	} catch (error) {

		throw new Error("Error in encrypting data")
	}
}

export const encryptSingle = async ({ data64,secretKeyObject }: any) => {

	const highestKey = Math.max(...Object.keys(secretKeyObject).filter(item=> !isNaN(+item)).map(Number));
	
	
	const highestKeyObject = secretKeyObject[highestKey];

	const Uint8ArrayData = base64ToUint8Array(data64)
	const nonce = base64ToUint8Array(highestKeyObject.nonce)
	const messageKey = base64ToUint8Array(highestKeyObject.messageKey)
	
	if (!(Uint8ArrayData instanceof Uint8Array)) {
		throw new Error("The Uint8ArrayData you've submitted is invalid")
	}
	try {
		const encryptedData = nacl.secretbox(Uint8ArrayData, nonce, messageKey);
	
		const encryptedDataBase64 = uint8ArrayToBase64(encryptedData)
		const highestKeyStr = highestKey.toString().padStart(10, '0');  // Fixed length of 10 digits
		const concatenatedData = highestKeyStr + encryptedDataBase64;
		const finalEncryptedData = btoa(concatenatedData);

	
		return finalEncryptedData;
	} catch (error) {
		
		throw new Error("Error in encrypting data")
	}
}

export const decryptSingle = async ({ data64,  secretKeyObject, skipDecodeBase64 }: any) => {
	

	const decodedData = skipDecodeBase64 ? data64 : atob(data64);
	
    // Extract the key (assuming it's 10 characters long)
	const decodeForNumber = atob(decodedData)
    const keyStr = decodeForNumber.slice(0, 10);
	
    // Convert the key string back to a number
    const highestKey = parseInt(keyStr, 10);
	
    // Extract the remaining part as the Base64-encoded encrypted data
    const encryptedDataBase64 = decodeForNumber.slice(10);
	let _encryptedMessage = encryptedDataBase64
	if(!secretKeyObject[highestKey]) throw new Error('Cannot find correct secretKey')
	const nonce64 = secretKeyObject[highestKey].nonce
	const messageKey64 = secretKeyObject[highestKey].messageKey

	const Uint8ArrayData = base64ToUint8Array(_encryptedMessage)
	const nonce = base64ToUint8Array(nonce64)
	const messageKey = base64ToUint8Array(messageKey64)
	
	if (!(Uint8ArrayData instanceof Uint8Array)) {
		throw new Error("The Uint8ArrayData you've submitted is invalid")
	}

	
		// Decrypt the data using the nonce and messageKey
		const decryptedData = nacl.secretbox.open(Uint8ArrayData, nonce, messageKey);
	
		// Check if decryption was successful
		if (!decryptedData) {
			throw new Error("Decryption failed");
		}
	
		// Convert the decrypted Uint8Array back to a UTF-8 string
		return uint8ArrayToBase64(decryptedData)
	
}


export function decryptGroupData(data64EncryptedData: string, privateKey: string) {
	
	const allCombined = base64ToUint8Array(data64EncryptedData)
	const str = "qortalGroupEncryptedData"
	const strEncoder = new TextEncoder()
	const strUint8Array = strEncoder.encode(str)
	// Extract the nonce
	const nonceStartPosition = strUint8Array.length
	const nonceEndPosition = nonceStartPosition + 24 // Nonce is 24 bytes
	const nonce = allCombined.slice(nonceStartPosition, nonceEndPosition)
	// Extract the shared keyNonce
	const keyNonceStartPosition = nonceEndPosition
	const keyNonceEndPosition = keyNonceStartPosition + 24 // Nonce is 24 bytes
	const keyNonce = allCombined.slice(keyNonceStartPosition, keyNonceEndPosition)
	// Extract the sender's public key
	const senderPublicKeyStartPosition = keyNonceEndPosition
	const senderPublicKeyEndPosition = senderPublicKeyStartPosition + 32 // Public keys are 32 bytes
	const senderPublicKey = allCombined.slice(senderPublicKeyStartPosition, senderPublicKeyEndPosition)
	// Calculate count first
	const countStartPosition = allCombined.length - 4 // 4 bytes before the end, since count is stored in Uint32 (4 bytes)
	const countArray = allCombined.slice(countStartPosition, countStartPosition + 4)
	const count = new Uint32Array(countArray.buffer)[0]
	// Then use count to calculate encryptedData
	const encryptedDataStartPosition = senderPublicKeyEndPosition // start position of encryptedData
	const encryptedDataEndPosition = allCombined.length - ((count * (32 + 16)) + 4)
	const encryptedData = allCombined.slice(encryptedDataStartPosition, encryptedDataEndPosition)
	// Extract the encrypted keys
	// 32+16 = 48
	const combinedKeys = allCombined.slice(encryptedDataEndPosition, encryptedDataEndPosition + (count * 48))
	if (!privateKey) {
		throw new Error("Unable to retrieve keys")
	}
	const decodedPrivateKey = Base58.decode(privateKey)
	const convertedPrivateKey = ed2curve.convertSecretKey(decodedPrivateKey)
	const convertedSenderPublicKey = ed2curve.convertPublicKey(senderPublicKey)
	const sharedSecret = new Uint8Array(32)
	nacl.lowlevel.crypto_scalarmult(sharedSecret, convertedPrivateKey, convertedSenderPublicKey)
	for (let i = 0; i < count; i++) {
		const encryptedKey = combinedKeys.slice(i * 48, (i + 1) * 48)
		// Decrypt the symmetric key.
		const decryptedKey = nacl.secretbox.open(encryptedKey, keyNonce, sharedSecret)
	
		// If decryption was successful, decryptedKey will not be null.
		if (decryptedKey) {
			// Decrypt the data using the symmetric key.
			const decryptedData = nacl.secretbox.open(encryptedData, nonce, decryptedKey)
			// If decryption was successful, decryptedData will not be null.
			if (decryptedData) {
				return {decryptedData, count}
			}
		}
	}
	throw new Error("Unable to decrypt data")
}