import { addListItems, createPoll, decryptData, deleteListItems, encryptData, getListItems, getUserAccount, joinGroup, publishMultipleQDNResources, publishQDNResource, saveFile, sendChatMessage, sendCoin, voteOnPoll } from "./qortalRequests/get";



// Promisify chrome.storage.local.get
function getLocalStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[key]);
      });
    });
  }
  
  // Promisify chrome.storage.local.set
  function setLocalStorage(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, function () {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  
  export async function setPermission(key, value) {
    try {
      // Get the existing qortalRequestPermissions object
      const qortalRequestPermissions = (await getLocalStorage('qortalRequestPermissions')) || {};
      
      // Update the permission
      qortalRequestPermissions[key] = value;
      
      // Save the updated object back to storage
      await setLocalStorage({ qortalRequestPermissions });
      
      console.log('Permission set for', key);
    } catch (error) {
      console.error('Error setting permission:', error);
    }
  }

  export async function getPermission(key) {
    try {
      // Get the qortalRequestPermissions object from storage
      const qortalRequestPermissions = (await getLocalStorage('qortalRequestPermissions')) || {};
      
      // Return the value for the given key, or null if it doesn't exist
      return qortalRequestPermissions[key] || null;
    } catch (error) {
      console.error('Error getting permission:', error);
      return null;
    }
  }


  // TODO: GET_FRIENDS_LIST
  // NOT SURE IF TO IMPLEMENT: LINK_TO_QDN_RESOURCE, QDN_RESOURCE_DISPLAYED, SET_TAB_NOTIFICATIONS
  
chrome?.runtime?.onMessage.addListener((request, sender, sendResponse) => {
  if (request) {
    switch (request.action) {
      case "GET_USER_ACCOUNT": {
        getUserAccount()
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: "Unable to get user account" });
          });

        break;
      }
      case "ENCRYPT_DATA": {
        const data = request.payload;
        
        encryptData(data, sender)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "DECRYPT_DATA": {
        const data = request.payload;
        
        decryptData(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "GET_LIST_ITEMS": {
        const data = request.payload;
        
        getListItems(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "ADD_LIST_ITEMS": {
        const data = request.payload;
        
        addListItems(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "DELETE_LIST_ITEM": {
        const data = request.payload;
        
        deleteListItems(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "PUBLISH_QDN_RESOURCE": {
        const data = request.payload;
        
        publishQDNResource(data, sender)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "PUBLISH_MULTIPLE_QDN_RESOURCES": {
        const data = request.payload;
        
        publishMultipleQDNResources(data, sender)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "VOTE_ON_POLL": {
        const data = request.payload;
        
        voteOnPoll(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "CREATE_POLL": {
        const data = request.payload;
        
        createPoll(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "SEND_CHAT_MESSAGE": {
        const data = request.payload;
        console.log('data', data)
        sendChatMessage(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "JOIN_GROUP": {
        const data = request.payload;
      
        joinGroup(data)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "SAVE_FILE": {
        const data = request.payload;
      
        saveFile(data, sender)
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: error.message });
          });

        break;
      }
      case "SEND_COIN": {
        const data = request.payload;
        const requiredFields = ["coin", "destinationAddress", "amount"];
        const missingFields: string[] = [];
        requiredFields.forEach((field) => {
          if (!data[field]) {
            missingFields.push(field);
          }
        });
        if (missingFields.length > 0) {
          const missingFieldsString = missingFields.join(", ");
          const errorMsg = `Missing fields: ${missingFieldsString}`;
          sendResponse({ error: errorMsg });
          break;
        }
        // Example: respond with the version
        sendCoin()
          .then((res) => {
            sendResponse(res);
          })
          .catch((error) => {
            sendResponse({ error: "Unable to get user account" });
          });

        break;
      }
    }
  }
  return true;
});
