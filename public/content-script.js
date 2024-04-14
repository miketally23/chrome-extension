 async function connection(hostname) {
  const isConnected = await chrome.storage.local.get([hostname]);
  let connected = false
  if(isConnected && Object.keys(isConnected).length > 0 && isConnected[hostname]){
    connected = true
  }
  return connected
}

// In your content script
document.addEventListener('qortalExtensionRequests', async (event) => {
  const { type, payload, requestId, timeout } = event.detail; // Capture the requestId
console.log({type})
  if (type === 'REQUEST_USER_INFO') {
    const hostname = window.location.hostname
    const res = await connection(hostname)
    console.log('is connected', res)
    if(!res){
      console.log('thou')
      document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
        detail: { type: "USER_INFO", data: {
          error: "Not authorized"
        }, requestId }
      }));
      return
    }
    chrome.runtime.sendMessage({ action: "userInfo" }, (response) => {
      if (response.error) {
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "USER_INFO", data: {
            error: response.error
          }, requestId }
        }));
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "USER_INFO", data: response, requestId }
        }));
      }
    });
  } else if (type === 'REQUEST_IS_INSTALLED') {
    chrome.runtime.sendMessage({ action: "version" }, (response) => {
      if (response.error) {
        console.error("Error:", response.error);
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "IS_INSTALLED", data: response, requestId }
        }));
      }
    });
  } else if (type === 'REQUEST_CONNECTION') {
    const hostname = window.location.hostname
    chrome.runtime.sendMessage({ action: "connection", payload: {
      hostname
    }, timeout }, (response) => {
      if (response.error) {
        console.error("Error:", response.error);
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "CONNECTION", data: response, requestId }
        }));
      }
    });
  } else if (type === 'REQUEST_AUTHENTICATION') {
    const hostname = window.location.hostname
    const res = await connection(hostname)
    if(!res){
      document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
        detail: { type: "USER_INFO", data: {
          error: "Not authorized"
        }, requestId }
      }));
      return
    }
    chrome.runtime.sendMessage({ action: "authentication", payload: {
      hostname
    },  timeout }, (response) => {
      if (response.error) {
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "AUTHENTICATION", data: {
            error: response.error
          }, requestId }
        }));
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "AUTHENTICATION", data: response, requestId }
        }));
      }
    });
  } else if (type === 'REQUEST_SEND_QORT') {
    const hostname = window.location.hostname
    const res = await connection(hostname)
    console.log('isconnected', res)
    if(!res){
      document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
        detail: { type: "USER_INFO", data: {
          error: "Not authorized"
        }, requestId }
      }));
      return
    }
    chrome.runtime.sendMessage({ action: "sendQort", payload: {
      hostname,
      amount: payload.amount,
      description: payload.description,
      address: payload.address
    }, timeout }, (response) => {
      if (response.error) {
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "SEND_QORT", data: {
            error: response.error
          }, requestId }
        }));
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "SEND_QORT", data: response, requestId }
        }));
      }
    });
  } else if (type === 'REQUEST_CLOSE_POPUP') {
    const hostname = window.location.hostname
    const res = await connection(hostname)
    if(!res){
      document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
        detail: { type: "USER_INFO", data: {
          error: "Not authorized"
        }, requestId }
      }));
      return
    }
    chrome.runtime.sendMessage({ action: "closePopup" }, (response) => {
      if (response.error) {
        
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "CLOSE_POPUP", data: {
            error: response.error
          }, requestId }
        }));
      } else {
        // Include the requestId in the detail when dispatching the response
        document.dispatchEvent(new CustomEvent('qortalExtensionResponses', {
          detail: { type: "CLOSE_POPUP", data: true, requestId }
        }));
      }
    });
  }
  // Handle other request types as needed...
});
