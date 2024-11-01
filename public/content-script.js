class Semaphore {
	constructor(count) {
		this.count = count
		this.waiting = []
	}
	acquire() {
		return new Promise(resolve => {
			if (this.count > 0) {
				this.count--
				resolve()
			} else {
				this.waiting.push(resolve)
			}
		})
	}
	release() {
		if (this.waiting.length > 0) {
			const resolve = this.waiting.shift()
			resolve()
		} else {
			this.count++
		}
	}
}
let semaphore = new Semaphore(1)
let reader = new FileReader()

const fileToBase64 = (file) => new Promise(async (resolve, reject) => {
	if (!reader) {
		reader = new FileReader()
	}
	await semaphore.acquire()
	reader.readAsDataURL(file)
	reader.onload = () => {
		const dataUrl = reader.result
		if (typeof dataUrl === "string") {
			const base64String = dataUrl.split(',')[1]
			reader.onload = null
			reader.onerror = null
			resolve(base64String)
		} else {
			reader.onload = null
			reader.onerror = null
			reject(new Error('Invalid data URL'))
		}
		semaphore.release()
	}
	reader.onerror = (error) => {
		reader.onload = null
		reader.onerror = null
		reject(error)
		semaphore.release()
	}
})




async function connection(hostname) {
  const isConnected = await chrome.storage.local.get([hostname]);
  let connected = false;
  if (
    isConnected &&
    Object.keys(isConnected).length > 0 &&
    isConnected[hostname]
  ) {
    connected = true;
  }
  return connected;
}

// In your content script
document.addEventListener("qortalExtensionRequests", async (event) => {
  const { type, payload, requestId, timeout } = event.detail; // Capture the requestId
  if (type === "REQUEST_USER_INFO") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);

    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage({ action: "userInfo" }, (response) => {
      if (response.error) {
        document.dispatchEvent(
          new CustomEvent("qortalExtensionResponses", {
            detail: {
              type: "USER_INFO",
              data: {
                error: response.error,
              },
              requestId,
            },
          })
        );
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(
          new CustomEvent("qortalExtensionResponses", {
            detail: { type: "USER_INFO", data: response, requestId },
          })
        );
      }
    });
  } else if (type === "REQUEST_IS_INSTALLED") {
    chrome?.runtime?.sendMessage({ action: "version" }, (response) => {
      if (response.error) {
        console.error("Error:", response.error);
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(
          new CustomEvent("qortalExtensionResponses", {
            detail: { type: "IS_INSTALLED", data: response, requestId },
          })
        );
      }
    });
  } else if (type === "REQUEST_CONNECTION") {
    const hostname = window.location.hostname;
    chrome?.runtime?.sendMessage(
      {
        action: "connection",
        payload: {
          hostname,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          console.error("Error:", response.error);
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "CONNECTION", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_OAUTH") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "OAUTH",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }

    chrome?.runtime?.sendMessage(
      {
        action: "oauth",
        payload: {
          nodeBaseUrl: payload.nodeBaseUrl,
          senderAddress: payload.senderAddress,
          senderPublicKey: payload.senderPublicKey,
          timestamp: payload.timestamp,
        },
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "OAUTH",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "OAUTH", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_BUY_ORDER") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "BUY_ORDER",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }

    chrome?.runtime?.sendMessage(
      {
        action: "buyOrder",
        payload: {
          qortalAtAddresses: payload.qortalAtAddresses,
          hostname,
          useLocal: payload?.useLocal,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "BUY_ORDER",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "BUY_ORDER", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_LTC_BALANCE") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage(
      {
        action: "ltcBalance",
        payload: {
          hostname,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "LTC_BALANCE",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "LTC_BALANCE", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "CHECK_IF_LOCAL") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage(
      {
        action: "checkLocal",
        payload: {
          hostname,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "CHECK_IF_LOCAL",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "CHECK_IF_LOCAL", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_AUTHENTICATION") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage(
      {
        action: "authentication",
        payload: {
          hostname,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "AUTHENTICATION",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "AUTHENTICATION", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_SEND_QORT") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage(
      {
        action: "sendQort",
        payload: {
          hostname,
          amount: payload.amount,
          description: payload.description,
          address: payload.address,
        },
        timeout,
      },
      (response) => {
        if (response.error) {
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: {
                type: "SEND_QORT",
                data: {
                  error: response.error,
                },
                requestId,
              },
            })
          );
        } else {
          // Include the requestId in the detail when dispatching the response
          document.dispatchEvent(
            new CustomEvent("qortalExtensionResponses", {
              detail: { type: "SEND_QORT", data: response, requestId },
            })
          );
        }
      }
    );
  } else if (type === "REQUEST_CLOSE_POPUP") {
    const hostname = window.location.hostname;
    const res = await connection(hostname);
    if (!res) {
      document.dispatchEvent(
        new CustomEvent("qortalExtensionResponses", {
          detail: {
            type: "USER_INFO",
            data: {
              error: "Not authorized",
            },
            requestId,
          },
        })
      );
      return;
    }
    chrome?.runtime?.sendMessage({ action: "closePopup" }, (response) => {
      if (response.error) {
        document.dispatchEvent(
          new CustomEvent("qortalExtensionResponses", {
            detail: {
              type: "CLOSE_POPUP",
              data: {
                error: response.error,
              },
              requestId,
            },
          })
        );
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(
          new CustomEvent("qortalExtensionResponses", {
            detail: { type: "CLOSE_POPUP", data: true, requestId },
          })
        );
      }
    });
  }
  // Handle other request types as needed...
});

async function handleGetFileFromIndexedDB(fileId, sendResponse) {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["files"], "readonly");
    const objectStore = transaction.objectStore("files");

    const getRequest = objectStore.get(fileId);

    getRequest.onsuccess = async function (event) {
      if (getRequest.result) {
        const file = getRequest.result.data;

        try {
          const base64String = await fileToBase64(file);

          // Create a new transaction to delete the file
          const deleteTransaction = db.transaction(["files"], "readwrite");
          const deleteObjectStore = deleteTransaction.objectStore("files");
          const deleteRequest = deleteObjectStore.delete(fileId);

          deleteRequest.onsuccess = function () {
            console.log(`File with ID ${fileId} has been removed from IndexedDB`);
            try {
              sendResponse({ result: base64String });

            } catch (error) {
              console.log('error', error)
            }
          };

          deleteRequest.onerror = function () {
            console.error(`Error deleting file with ID ${fileId} from IndexedDB`);
            sendResponse({ result: null, error: "Failed to delete file from IndexedDB" });
          };
        } catch (error) {
          console.error("Error converting file to Base64:", error);
          sendResponse({ result: null, error: "Failed to convert file to Base64" });
        }
      } else {
        console.error(`File with ID ${fileId} not found in IndexedDB`);
        sendResponse({ result: null, error: "File not found in IndexedDB" });
      }
    };

    getRequest.onerror = function () {
      console.error(`Error retrieving file with ID ${fileId} from IndexedDB`);
      sendResponse({ result: null, error: "Error retrieving file from IndexedDB" });
    };
  } catch (error) {
    console.error("Error opening IndexedDB:", error);
    sendResponse({ result: null, error: "Error opening IndexedDB" });
  } 
}

const testAsync = async (sendResponse)=> {
  await new Promise((res)=> {
    setTimeout(() => {
      res()
    }, 2500);
  })
  sendResponse({ result: null, error: "Testing" });
}

const saveFile = (blob, filename) => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  // Append the link to the document and trigger a click
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the link and revoking the object URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};




const showSaveFilePicker = async (data) => {
  let blob
  let fileName
  try {
    const {filename, mimeType,  fileHandleOptions, fileId} = data
     blob = await retrieveFileFromIndexedDB(fileId)
     fileName = filename
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
            {
                description: mimeType,
                ...fileHandleOptions
            }
        ]
    })
    const writeFile = async (fileHandle, contents) => {
        const writable = await fileHandle.createWritable()
        await writable.write(contents)
        await writable.close()
    }
    writeFile(fileHandle, blob).then(() => console.log("FILE SAVED"))
} catch (error) {
  saveFile(blob, fileName)
} 
}

chrome.runtime?.onMessage.addListener( function (message, sender, sendResponse) {
  if (message.type === "LOGOUT") {
    // Notify the web page
    window.postMessage(
      {
        type: "LOGOUT",
        from: "qortal",
      },
      "*"
    );
  } else if (message.type === "RESPONSE_FOR_TRADES") {
    // Notify the web page
    window.postMessage(
      {
        type: "RESPONSE_FOR_TRADES",
        from: "qortal",
        payload: message.message,
      },
      "*"
    );
  } else if(message.action === "SHOW_SAVE_FILE_PICKER"){
    showSaveFilePicker(message?.data)
  }

  else  if (message.action === "getFileFromIndexedDB") {
    handleGetFileFromIndexedDB(message.fileId, sendResponse);
    return true; // Keep the message channel open for async response
  }
});

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fileStorageDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function () {
      reject("Error opening IndexedDB");
    };
  });
}


async function retrieveFileFromIndexedDB(fileId) {
  const db = await openIndexedDB();
  const transaction = db.transaction(["files"], "readwrite");
  const objectStore = transaction.objectStore("files");

  return new Promise((resolve, reject) => {
    const getRequest = objectStore.get(fileId);

    getRequest.onsuccess = function (event) {
      if (getRequest.result) {
        // File found, resolve it and delete from IndexedDB
        const file = getRequest.result.data;
        objectStore.delete(fileId);
        resolve(file);
      } else {
        reject("File not found in IndexedDB");
      }
    };

    getRequest.onerror = function () {
      reject("Error retrieving file from IndexedDB");
    };
  });
}

async function deleteQortalFilesFromIndexedDB() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["files"], "readwrite");
    const objectStore = transaction.objectStore("files");

    // Create a request to get all keys
    const getAllKeysRequest = objectStore.getAllKeys();

    getAllKeysRequest.onsuccess = function (event) {
      const keys = event.target.result;

      // Iterate through keys to find and delete those containing '_qortalfile'
      for (let key of keys) {
        if (key.includes("_qortalfile")) {
          const deleteRequest = objectStore.delete(key);

          deleteRequest.onsuccess = function () {
            console.log(`File with key '${key}' has been deleted from IndexedDB`);
          };

          deleteRequest.onerror = function () {
            console.error(`Failed to delete file with key '${key}' from IndexedDB`);
          };
        }
      }
    };

    getAllKeysRequest.onerror = function () {
      console.error("Failed to retrieve keys from IndexedDB");
    };

    transaction.oncomplete = function () {
      console.log("Transaction complete for deleting files from IndexedDB");
    };

    transaction.onerror = function () {
      console.error("Error occurred during transaction for deleting files");
    };
  } catch (error) {
    console.error("Error opening IndexedDB:", error);
  }
}


async function storeFilesInIndexedDB(obj) {
  // First delete any existing files in IndexedDB with '_qortalfile' in their ID
  await deleteQortalFilesFromIndexedDB();

  // Open the IndexedDB
  const db = await openIndexedDB();
  const transaction = db.transaction(["files"], "readwrite");
  const objectStore = transaction.objectStore("files");

  // Handle the obj.file if it exists and is a File instance
  if (obj.file instanceof File) {
    const fileId = "objFile_qortalfile";

    // Store the file in IndexedDB
    const fileData = {
      id: fileId,
      data: obj.file,
    };
    objectStore.put(fileData);

    // Replace the file object with the file ID in the original object
    obj.fileId = fileId;
    delete obj.file;
  }
  if (obj.blob instanceof Blob) {
    const fileId = "objFile_qortalfile";

    // Store the file in IndexedDB
    const fileData = {
      id: fileId,
      data: obj.blob,
    };
    objectStore.put(fileData);

    // Replace the file object with the file ID in the original object
    let blobObj = {
      type: obj.blob?.type
    }
    obj.fileId = fileId;
    delete obj.blob;
    obj.blob = blobObj
  }

  // Iterate through resources to find files and save them to IndexedDB
  for (let resource of (obj?.resources || [])) {
    if (resource.file instanceof File) {
      const fileId = resource.identifier + "_qortalfile";

      // Store the file in IndexedDB
      const fileData = {
        id: fileId,
        data: resource.file,
      };
      objectStore.put(fileData);

      // Replace the file object with the file ID in the original object
      resource.fileId = fileId;
      delete resource.file;
    }
  }

  // Set transaction completion handlers
  transaction.oncomplete = function () {
    console.log("Files saved successfully to IndexedDB");
  };

  transaction.onerror = function () {
    console.error("Error saving files to IndexedDB");
  };

  return obj; // Updated object with references to stored files
}



const UIQortalRequests = ['GET_USER_ACCOUNT', 'DECRYPT_DATA', 'SEND_COIN', 'GET_LIST_ITEMS', 'ADD_LIST_ITEMS', 'DELETE_LIST_ITEM', 'VOTE_ON_POLL', 'CREATE_POLL', 'SEND_CHAT_MESSAGE', 'JOIN_GROUP', 'DEPLOY_AT', 'GET_USER_WALLET', 'GET_WALLET_BALANCE', 'GET_USER_WALLET_INFO', 'GET_CROSSCHAIN_SERVER_INFO', 'GET_TX_ACTIVITY_SUMMARY', 'GET_FOREIGN_FEE', 'UPDATE_FOREIGN_FEE', 'GET_SERVER_CONNECTION_HISTORY', 'SET_CURRENT_FOREIGN_SERVER', 'ADD_FOREIGN_SERVER', 'REMOVE_FOREIGN_SERVER', 'GET_DAY_SUMMARY']

if (!window.hasAddedQortalListener) {
  window.hasAddedQortalListener = true;
  //qortalRequests
  const listener = async (event) => {
    event.preventDefault();  // Prevent default behavior
    event.stopImmediatePropagation();  // Stop other listeners from firing
  
    // Verify that the message is from the web page and contains expected data
    if (event.source !== window || !event.data || !event.data.action) return;
  
    if (event?.data?.requestedHandler !== 'UI') return;

   await new Promise((res)=> {
    chrome?.runtime?.sendMessage(
      {
        action: "authentication",
        timeout: 60,
      },
      (response) => {
        if (response.error) {
          eventPort.postMessage({
            result: null,
            error: 'User not authenticated',
          });
          res()
          return
        } else {
          res()
        }
      }
    );
   }) 
  
    const sendMessageToRuntime = (message, eventPort) => {
      chrome?.runtime?.sendMessage(message, (response) => {
        if (response.error) {
          eventPort.postMessage({
            result: null,
            error: response,
          });
        } else {
          eventPort.postMessage({
            result: response,
            error: null,
          });
        }
      });
    };
  
    // Check if action is included in the predefined list of UI requests
    if (UIQortalRequests.includes(event.data.action)) {
      sendMessageToRuntime(
        { action: event.data.action, type: 'qortalRequest', payload: event.data },
        event.ports[0]
      );
    } else if (event?.data?.action === 'PUBLISH_MULTIPLE_QDN_RESOURCES' || event?.data?.action === 'PUBLISH_QDN_RESOURCE' || event?.data?.action === 'ENCRYPT_DATA' || event?.data?.action === 'SAVE_FILE') {
      let data;
      try {
        data = await storeFilesInIndexedDB(event.data);
      } catch (error) {
        console.error('Error storing files in IndexedDB:', error);
        event.ports[0].postMessage({
          result: null,
          error: 'Failed to store files in IndexedDB',
        });
        return;
      }
  
      if (data) {
        sendMessageToRuntime(
          { action: event.data.action, type: 'qortalRequest', payload: data },
          event.ports[0]
        );
      } else {
        event.ports[0].postMessage({
          result: null,
          error: 'Failed to prepare data for publishing',
        });
      }
    }
  };
  
  // Add the listener for messages coming from the window
  window.addEventListener('message', listener);
  
}

window.addEventListener("message", (event) => {
  // Ensure the message is from the same page
  if (event.source !== window || !event.data || event.data.type !== "qortalExtensionRequests") return;

  // Extract the message detail
  const { detail } = event.data;

  // Forward the message to the background script and listen for a response
 
  chrome?.runtime?.sendMessage({ action: "version" }, (response) => {
    if (response.error) {
      console.error("Error:", response.error);
    } else {
      // Include the requestId in the detail when dispatching the response
      window.postMessage(
        { type: "qortalExtensionResponses", detail: { requestId: detail.requestId, data: response } },
        "*"
    );
    }
  });
});

