import { addListItems, decryptData, deleteListItems, encryptData, getListItems, getUserAccount, sendCoin } from "./qortalRequests/get";

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
        
        encryptData(data)
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
