// @ts-nocheck

import { crypto, walletVersion } from '../../constants/decryptWallet';
import { doInitWorkers, kdf } from '../../deps/kdf';
import PhraseWallet from './phrase-wallet';
import * as WORDLISTS from './wordlists';

export function generateRandomSentence(template = 'adverb verb noun adjective noun adverb verb noun adjective noun adjective verbed adjective noun', maxWordLength = 0, capitalize = true) {
    const partsOfSpeechMap = {
        'noun': 'nouns',
        'adverb': 'adverbs',
        'adv': 'adverbs',
        'verb': 'verbs',
        'interjection': 'interjections',
        'adjective': 'adjectives',
        'adj': 'adjectives',
        'verbed': 'verbed'
    };

    let _wordlists = WORDLISTS;

    function _RNG(entropy) {
        if (entropy > 1074) {
            throw new Error('Javascript can not handle that much entropy!');
        }
        let randNum = 0;
        const crypto = window.crypto || window.msCrypto;

        if (crypto) {
            const entropy256 = Math.ceil(entropy / 8);
            let buffer = new Uint8Array(entropy256);
            crypto.getRandomValues(buffer);
            randNum = buffer.reduce((num, value) => num * 256 + value, 0) / Math.pow(256, entropy256);
        } else {
            console.warn('Secure RNG not found. Using Math.random');
            randNum = Math.random();
        }
        return randNum;
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getWord(partOfSpeech) {
        let words = _wordlists[partsOfSpeechMap[partOfSpeech]];
        if (maxWordLength) {
            words = words.filter(word => word.length <= maxWordLength);
        }
        const requiredEntropy = Math.log(words.length) / Math.log(2);
        const index = Math.floor(_RNG(requiredEntropy) * words.length);
        return words[index];
    }

    function parse(template) {
        return template.split(/\s+/).map(token => {
            const match = token.match(/^(\w+)(.*)$/);
            if (!match) return token; // No match, return original token

            const [ , partOfSpeech, rest ] = match;
            if (partsOfSpeechMap[partOfSpeech]) {
                let word = getWord(partOfSpeech);
                if (capitalize && token === token[0].toUpperCase() + token.slice(1).toLowerCase()) {
                    word = _capitalize(word);
                }
                return word + rest;
            }

            return token;
        }).join(' ');
    }

    return parse(template);
}

export const createAccount = async()=> {
    const generatedSeedPhrase = generateRandomSentence()
    const threads = doInitWorkers(crypto.kdfThreads)

    const seed = await kdf(generatedSeedPhrase, void 0, threads)
    const wallet = new PhraseWallet(seed, walletVersion)
    return wallet
       
  }

  export const  saveFileToDisk= async(data, qortAddress) => {
    try {
    const dataString = JSON.stringify(data)
        const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })
        const fileName = "qortal_backup_" + qortAddress + ".json"
        // Feature detection. The API needs to be supported
        // and the app not run in an iframe.
        const supportsFileSystemAccess =
        'showSaveFilePicker' in window &&
        (() => {
            try {
                return window.self === window.top
            } catch {
                return false
            }
        })()
        // If the File System Access API is supported...
        if (supportsFileSystemAccess) {
            try {
            // Show the file save dialog.
            const fileHandle = await window.showSaveFilePicker({
            suggestedName: fileName,
            types: [{
                    description: "File",
            }]
        })
            // Write the blob to the file.
            const writable = await fileHandle.createWritable()
            await writable.write(blob)
            await writable.close()
            console.log("FILE SAVED")
            return
        } catch (err) {
            // Fail silently if the user has simply canceled the dialog.
            if (err.name !== 'AbortError') {
            console.error(err.name, err.message)
            return
            }
        }
        }
      // Fallback if the File System Access API is not supported...
      // Create the blob URL.
      const blobURL = URL.createObjectURL(blob)
      // Create the `<a download>` element and append it invisibly.
      const a = document.createElement('a')
      a.href = blobURL
      a.download = fileName
      a.style.display = 'none'
      document.body.append(a)
      // Programmatically click the element.
      a.click()
      // Revoke the blob URL and remove the element.
      setTimeout(() => {
        URL.revokeObjectURL(blobURL);
        a.remove();
      }, 1000);
    } catch (error) {
        console.log({error})
    }
}