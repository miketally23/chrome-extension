// @ts-nocheck

import {bytes_to_base64 as bytesToBase64, Sha512} from 'asmcrypto.js'
import bcrypt from 'bcryptjs'
import utils from '../utils/utils'
import { crypto } from '../constants/decryptWallet'
const stringtoUTF8Array = (message)=> {
    if (typeof message === 'string') {
        var s = unescape(encodeURIComponent(message)) // UTF-8
        message = new Uint8Array(s.length)
        for (var i = 0; i < s.length; i++) {
            message[i] = s.charCodeAt(i) & 0xff
        }
    }
    return message
}

const stringToUTF8Array=(message)=> {
    console.log({message})
    if (typeof message !== 'string') return message; // Assuming you still want to pass through non-string inputs unchanged
    const encoder = new TextEncoder(); // TextEncoder defaults to UTF-8
    return encoder.encode(message);
}
const computekdf = async (req)=> {
    const { salt, key, nonce, staticSalt, staticBcryptSalt } = req
    const combinedBytes = utils.appendBuffer(new Uint8Array([]), stringToUTF8Array(`${staticSalt}${key}${nonce}`))
    const sha512Hash = new Sha512().process(combinedBytes).finish().result
    const sha512HashBase64 = bytesToBase64(sha512Hash)
    const result = bcrypt.hashSync(sha512HashBase64.substring(0, 72), staticBcryptSalt)
    if(nonce === 0){
        console.log({salt, key, nonce, staticSalt, staticBcryptSalt})
        console.log({combinedBytes})
        console.log({sha512Hash})
        console.log({sha512HashBase64})
        console.log({result})

    }
    return { key, nonce, result }
}

export const doInitWorkers = (numberOfWorkers) => {
    const workers = []

        try {
            for (let i = 0; i < numberOfWorkers; i++) {
                workers.push({})
            }
           
        } catch (e) {
        }
  
    return workers
}

export const kdf = async (seed, salt, threads) => {
    console.log({seed, salt, threads})
	const workers = threads
    const salt2 = 	new Uint8Array(salt)

	salt = new Uint8Array(salt)
    console.log({salt, salt2})
	const seedParts = await Promise.all(workers.map((worker, index) => {
		const nonce = index
		return computekdf({
			key: seed,
			salt,
			nonce,
			staticSalt: crypto.staticSalt,
			staticBcryptSalt: crypto.staticBcryptSalt
		}).then(data => {
            console.log({data})
			let jsonData
			try {
				jsonData = JSON.parse(data)
				data = jsonData
			} catch (e) {
				// ...
			}
			// if (seed !== data.key) throw new Error(kst3 + seed + ' !== ' + data.key)
			// if (nonce !== data.nonce) throw new Error(kst4)
			return data.result
		})
	}))
    console.log({seedParts})
	const result = new Sha512().process(stringtoUTF8Array(crypto.staticSalt + seedParts.reduce((a, c) => a + c))).finish().result
	return result
}
