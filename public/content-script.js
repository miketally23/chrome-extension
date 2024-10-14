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

chrome.runtime?.onMessage.addListener(function (message, sender, sendResponse) {
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
  }
});

const lastActionTimestamps = {};

// Function to debounce actions based on message.action
function debounceAction(action, wait = 500) {
  const currentTime = Date.now();

  // Check if this action has been recently triggered
  if (lastActionTimestamps[action] && currentTime - lastActionTimestamps[action] < wait) {
    // Ignore this action if it occurred within the debounce time window
    return false;
  }

  // Update the last timestamp for this action
  lastActionTimestamps[action] = currentTime;
  return true;
}

if (!window.hasAddedQortalListener) {
  console.log("Listener added");
  window.hasAddedQortalListener = true;
  //qortalRequests
  const listener = (event) => {

    event.preventDefault();  // Prevent default behavior
    event.stopImmediatePropagation();  // Stop other listeners from firing
    // Verify that the message is from the web page and contains expected data
    if (event.source !== window || !event.data || !event.data.action) return;
    //  // Check if this action should be processed (debounced)
    //  if (!debounceAction(event.data.action)) {
    //   console.log(`Debounced action: ${event.data.action}`);
    //   return;
    // }
    if(event?.data?.requestedHandler !== 'UI') return
    if (event.data.action === "GET_USER_ACCOUNT") {
      chrome?.runtime?.sendMessage(
        { action: "GET_USER_ACCOUNT", type: "qortalRequest" },
        (response) => {
          if (response.error) {
            event.ports[0].postMessage({
              result: null,
              error: response.error,
            });
          } else {
            event.ports[0].postMessage({
              result: response,
              error: null,
            });
          }
        }
      );
    } else if (event.data.action === "SEND_COIN") {
      chrome?.runtime?.sendMessage(
        { action: "SEND_COIN", type: "qortalRequest", payload: event.data },
        (response) => {
          if (response.error) {
            event.ports[0].postMessage({
              result: null,
              error: response.error,
            });
          } else {
            event.ports[0].postMessage({
              result: response,
              error: null,
            });
          }
        }
      );
    } else if (event.data.action === "ENCRYPT_DATA") {
      chrome?.runtime?.sendMessage(
        { action: "ENCRYPT_DATA", type: "qortalRequest", payload: event.data },
        (response) => {
          if (response.error) {
            event.ports[0].postMessage({
              result: null,
              error: response.error,
            });
          } else {
            event.ports[0].postMessage({
              result: response,
              error: null,
            });
          }
        }
      );
    } else if (event.data.action === "DECRYPT_DATA") {
      chrome?.runtime?.sendMessage(
        { action: "DECRYPT_DATA", type: "qortalRequest", payload: event.data },
        (response) => {
          if (response.error) {
            event.ports[0].postMessage({
              result: null,
              error: response.error,
            });
          } else {
            event.ports[0].postMessage({
              result: response,
              error: null,
            });
          }
        }
      );
    } else if (event.data.action === "GET_LIST_ITEMS") {
      console.log("message", event);

      chrome?.runtime?.sendMessage(
        {
          action: "GET_LIST_ITEMS",
          type: "qortalRequest",
          payload: event.data,
        },
        (response) => {
          console.log("response", response);
          if (response.error) {
            event.ports[0].postMessage({
              result: null,
              error: response.error,
            });
          } else {
            event.ports[0].postMessage({
              result: response,
              error: null,
            });
          }
        }
      );
    }
  };
  window.addEventListener("message", listener);
}
