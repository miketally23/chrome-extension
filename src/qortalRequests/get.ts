import { createEndpoint, getKeyPair, getSaveWallet, removeDuplicateWindow } from "../background";
import Base58 from "../deps/Base58";
import {
  base64ToUint8Array,
  decryptDeprecatedSingle,
  decryptGroupData,
  encryptDataGroup,
  uint8ArrayStartsWith,
  uint8ArrayToBase64,
} from "../qdn/encryption/group-encryption";
import { fileToBase64 } from "../utils/fileReading";

async function getUserPermission(payload: any) {
   

    function waitForWindowReady(windowId) {
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            chrome.windows.get(windowId, (win) => {
              if (chrome.runtime.lastError) {
                clearInterval(checkInterval); // Stop polling if there's an error
                resolve(false);
              } else if (win.state === 'normal' || win.state === 'maximized') {
                clearInterval(checkInterval); // Window is ready
                resolve(true);
              }
            });
          }, 100); // Check every 100ms
        });
      }
    
      await new Promise((res)=> {
        const popupUrl = chrome.runtime.getURL(
            "index.html?secondary=true"
          );
            console.log('popupUrl', popupUrl)
          chrome.windows.getAll(
            { populate: true, windowTypes: ["popup"] },
            (windows) => {
                console.log('windows', windows)
              // Attempt to find an existing popup window that has a tab with the correct URL
              const existingPopup = windows.find(
                (w) =>
                  w.tabs &&
                  w.tabs.some(
                    (tab) => tab.url && tab.url.startsWith(popupUrl)
                  )
              );
              if (existingPopup) {
                // If the popup exists but is minimized or not focused, focus it
                chrome.windows.update(existingPopup.id, {
                  focused: true,
                  state: "normal",
                });
                res(null)
              } else {
                // No existing popup found, create a new one
                chrome.system.display.getInfo((displays) => {
                  // Assuming the primary display is the first one (adjust logic as needed)
                  const primaryDisplay = displays[0];
                  const screenWidth = primaryDisplay.bounds.width;
                  const windowHeight = 500; // Your window height
                  const windowWidth = 400; // Your window width
    
                  // Calculate left position for the window to appear on the right of the screen
                  const leftPosition = screenWidth - windowWidth;
    
                  // Calculate top position for the window, adjust as desired
                  const topPosition =
                    (primaryDisplay.bounds.height - windowHeight) / 2;
    
                  chrome.windows.create(
                    {
                      url: popupUrl,
                      type: "popup",
                      width: windowWidth,
                      height: windowHeight,
                      left: leftPosition,
                      top: 0,
                    },
                    async (newWindow) => {
                        removeDuplicateWindow(popupUrl);
                        await waitForWindowReady(newWindow.id);
                     
                      res(null)
                    }
                  );
               
                });
              }
    
    
         
              
            }
          );
      })

      await new Promise((res)=> {
        setTimeout(() => {
            chrome.runtime.sendMessage({
              action: "SET_COUNTDOWN",
              payload: 15,
            });
            res(true)
          }, 450);
      })
    return new Promise((resolve) => {
      // Set a timeout for 1 second
      const timeout = setTimeout(() => {
        resolve(false); // No response within 10 second, assume not focused
      }, 15000);
  
      // Send message to the content script to check focus
      console.log('send msg')
      chrome.runtime.sendMessage({ action: "QORTAL_REQUEST_PERMISSION", payload }, (response) => {
        console.log('permission response', response)
        if(response === undefined) return
        clearTimeout(timeout); // Clear the timeout if we get a response
  
        if (chrome.runtime.lastError) {
          resolve(false); // Error occurred, assume not focused
        } else {
          resolve(response); // Resolve based on the response
        }
      });
    });
  }

export const getUserAccount = async () => {
  try {
    const wallet = await getSaveWallet();
    const address = wallet.address0;
    const publicKey = wallet.publicKey;
    return {
      address,
      publicKey,
    };
  } catch (error) {
    throw new Error("Unable to fetch user account");
  }
};

export const encryptData = async (data) => {
  let data64 = data.data64;
  let publicKeys = data.publicKeys || [];
  if (data.file) {
    data64 = await fileToBase64(data.file);
  }
  if (!data64) {
    throw new Error("Please include data to encrypt");
  }

  const resKeyPair = await getKeyPair();
  const parsedData = JSON.parse(resKeyPair);
  const privateKey = parsedData.privateKey;
  const userPublicKey = parsedData.publicKey;

  const encryptDataResponse = encryptDataGroup({
    data64,
    publicKeys: publicKeys,
    privateKey,
    userPublicKey,
  });
  if (encryptDataResponse) {
    return encryptDataResponse;
  } else {
    throw new Error("Unable to encrypt");
  }
};
export const decryptData = async (data) => {
  const { encryptedData, publicKey } = data;


  if (!encryptedData) {
    throw new Error(`Missing fields: encryptedData`);
  }
  const resKeyPair = await getKeyPair();
  const parsedData = JSON.parse(resKeyPair);
  const uint8PrivateKey = Base58.decode(parsedData.privateKey);
  const uint8Array = base64ToUint8Array(encryptedData);
  const startsWithQortalEncryptedData = uint8ArrayStartsWith(
    uint8Array,
    "qortalEncryptedData"
  );
  if (startsWithQortalEncryptedData) {
    if (!publicKey) {
      throw new Error(`Missing fields: publicKey`);
    }

    const decryptedDataToBase64 = decryptDeprecatedSingle(
      uint8Array,
      publicKey,
      uint8PrivateKey
    );
    return decryptedDataToBase64;
  }
  const startsWithQortalGroupEncryptedData = uint8ArrayStartsWith(
    uint8Array,
    "qortalGroupEncryptedData"
  );
  if (startsWithQortalGroupEncryptedData) {
    const decryptedData = decryptGroupData(
      encryptedData,
      parsedData.privateKey
    );
    const decryptedDataToBase64 = uint8ArrayToBase64(decryptedData);
    return decryptedDataToBase64;
  }
  throw new Error("Unable to decrypt");
};



export const getListItems = async (data) => {
    const requiredFields = ['list_name']
					const missingFields: string[] = []
					requiredFields.forEach((field) => {
						if (!data[field]) {
							missingFields.push(field)
						}
					})
					if (missingFields.length > 0) {
						const missingFieldsString = missingFields.join(', ')
						const errorMsg = `Missing fields: ${missingFieldsString}`
						throw new Error(errorMsg)
					}
					let skip = false
					// if (window.parent.reduxStore.getState().app.qAPPAutoLists) {
					// 	skip = true
					// }
					let resPermission
					if (!skip) {
						// res1 = await showModalAndWait(
						// 	actions.GET_LIST_ITEMS,
						// 	{
						// 		list_name: data.list_name
						// 	}
						// )

                         resPermission = await getUserPermission({
                            text1: 'Do you give this application permission to',
                            text2: 'Access the list',
                            text3: data.list_name
                         })

					}
                    console.log('resPermission', resPermission)
					if (resPermission || skip) {
						try {
							
                            const url = await createEndpoint(`/lists/${data.list_name}`);
                            console.log('url', url)
                            const response = await fetch(url);
                            console.log('response', response)
                            if (!response.ok) throw new Error("Failed to fetch");
                      
                            const list = await response.json();
							return list

						} catch (error) {
							throw new Error("Error in retrieving list")
						} 
					} else {
						const data = {}
						throw new Error("User declined to share list")
					}
  };

export const sendCoin = async () => {
  try {
    const wallet = await getSaveWallet();
    const address = wallet.address0;
    const publicKey = wallet.publicKey;
    return {
      address,
      publicKey,
    };
  } catch (error) {
    console.error(error);
  }
};
