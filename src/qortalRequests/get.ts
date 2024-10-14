import {
  createEndpoint,
  getFee,
  getKeyPair,
  getSaveWallet,
  removeDuplicateWindow,
} from "../background";
import { getNameInfo } from "../backgroundFunctions/encryption";
import Base58 from "../deps/Base58";
import {
  base64ToUint8Array,
  decryptDeprecatedSingle,
  decryptGroupData,
  encryptDataGroup,
  uint8ArrayStartsWith,
  uint8ArrayToBase64,
} from "../qdn/encryption/group-encryption";
import { publishData } from "../qdn/publish/pubish";
import { getPermission, setPermission } from "../qortalRequests";
import { fileToBase64 } from "../utils/fileReading";

async function getUserPermission(payload: any) {
  function waitForWindowReady(windowId) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        chrome.windows.get(windowId, (win) => {
          if (chrome.runtime.lastError) {
            clearInterval(checkInterval); // Stop polling if there's an error
            resolve(false);
          } else if (win.state === "normal" || win.state === "maximized") {
            clearInterval(checkInterval); // Window is ready
            resolve(true);
          }
        });
      }, 100); // Check every 100ms
    });
  }

  await new Promise((res) => {
    const popupUrl = chrome.runtime.getURL("index.html?secondary=true");
    console.log("popupUrl", popupUrl);
    chrome.windows.getAll(
      { populate: true, windowTypes: ["popup"] },
      (windows) => {
        console.log("windows", windows);
        // Attempt to find an existing popup window that has a tab with the correct URL
        const existingPopup = windows.find(
          (w) =>
            w.tabs &&
            w.tabs.some((tab) => tab.url && tab.url.startsWith(popupUrl))
        );
        if (existingPopup) {
          // If the popup exists but is minimized or not focused, focus it
          chrome.windows.update(existingPopup.id, {
            focused: true,
            state: "normal",
          });
          res(null);
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

                res(null);
              }
            );
          });
        }
      }
    );
  });

  await new Promise((res) => {
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "SET_COUNTDOWN",
        payload: 30,
      });
      res(true);
    }, 1000);
  });
  return new Promise((resolve) => {
    // Set a timeout for 1 second
    const timeout = setTimeout(() => {
      resolve(false); // No response within 10 second, assume not focused
    }, 30000);

    // Send message to the content script to check focus
    console.log("send msg");
    chrome.runtime.sendMessage(
      { action: "QORTAL_REQUEST_PERMISSION", payload },
      (response) => {
        console.log("permission response", response);
        if (response === undefined) return;
        clearTimeout(timeout); // Clear the timeout if we get a response

        if (chrome.runtime.lastError) {
          resolve(false); // Error occurred, assume not focused
        } else {
          resolve(response); // Resolve based on the response
        }
      }
    );
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
  const requiredFields = ["list_name"];
  const missingFields: string[] = [];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    const errorMsg = `Missing fields: ${missingFieldsString}`;
    throw new Error(errorMsg);
  }
  const value = (await getPermission("qAPPAutoLists")) || false;

  let skip = false;
  if (value) {
    skip = true;
  }
  let resPermission;
  let acceptedVar;
  let checkbox1Var;
  if (!skip) {
    resPermission = await getUserPermission({
      text1: "Do you give this application permission to",
      text2: "Access the list",
      highlightedText: data.list_name,
      checkbox1: {
        value: value,
        label: "Always allow lists to be retrieved automatically",
      },
    });
    const { accepted, checkbox1 } = resPermission;
    acceptedVar = accepted;
    checkbox1Var = checkbox1;
    setPermission("qAPPAutoLists", checkbox1);
  }

  if (acceptedVar || skip) {
    const url = await createEndpoint(`/lists/${data.list_name}`);
    console.log("url", url);
    const response = await fetch(url);
    console.log("response", response);
    if (!response.ok) throw new Error("Failed to fetch");

    const list = await response.json();
    console.log("list", list);
    return list;
  } else {
    throw new Error("User declined to share list");
  }
};

export const addListItems = async (data) => {
  const requiredFields = ["list_name", "items"];
  const missingFields: string[] = [];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    const errorMsg = `Missing fields: ${missingFieldsString}`;
    throw new Error(errorMsg);
  }

  const items = data.items;
  const list_name = data.list_name;

  const resPermission = await getUserPermission({
    text1: "Do you give this application permission to",
    text2: `Add the following to the list ${list_name}:`,
    highlightedText: items.join(", "),
  });
  const { accepted } = resPermission;

  if (accepted) {
    const url = await createEndpoint(`/lists/${list_name}`);
    console.log("url", url);
    const body = {
      items: items,
    };
    const bodyToString = JSON.stringify(body);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToString,
    });

    console.log("response", response);
    if (!response.ok) throw new Error("Failed to add to list");
    let res;
    try {
      res = await response.clone().json();
    } catch (e) {
      res = await response.text();
    }
    return res;
  } else {
    throw new Error("User declined add to list");
  }
};

export const deleteListItems = async (data) => {
  const requiredFields = ["list_name", "item"];
  const missingFields: string[] = [];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    const errorMsg = `Missing fields: ${missingFieldsString}`;
    throw new Error(errorMsg);
  }

  const item = data.item;
  const list_name = data.list_name;

  const resPermission = await getUserPermission({
    text1: "Do you give this application permission to",
    text2: `Remove the following from the list ${list_name}:`,
    highlightedText: item,
  });
  const { accepted } = resPermission;

  if (accepted) {
    const url = await createEndpoint(`/lists/${list_name}`);
    console.log("url", url);
    const body = {
      items: [item],
    };
    const bodyToString = JSON.stringify(body);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyToString,
    });

    console.log("response", response);
    if (!response.ok) throw new Error("Failed to add to list");
    let res;
    try {
      res = await response.clone().json();
    } catch (e) {
      res = await response.text();
    }
    return res;
  } else {
    throw new Error("User declined add to list");
  }
};

export const publishQDNResource = async (data: any) => {
  const requiredFields = ["service"];
  const missingFields: string[] = [];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });
  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(", ");
    const errorMsg = `Missing fields: ${missingFieldsString}`;
    throw new Error(errorMsg);
  }
  if (!data.file && !data.data64) {
    throw new Error("No data or file was submitted");
  }
  // Use "default" if user hasn't specified an identifer
  const service = data.service;
  const registeredName = await getNameInfo();
  const name = registeredName;
  let identifier = data.identifier;
  let data64 = data.data64;
  const filename = data.filename;
  const title = data.title;
  const description = data.description;
  const category = data.category;
  const tag1 = data.tag1;
  const tag2 = data.tag2;
  const tag3 = data.tag3;
  const tag4 = data.tag4;
  const tag5 = data.tag5;
  let feeAmount = null;
  if (data.identifier == null) {
    identifier = "default";
  }
  if (
    data.encrypt &&
    (!data.publicKeys ||
      (Array.isArray(data.publicKeys) && data.publicKeys.length === 0))
  ) {
    throw new Error("Encrypting data requires public keys");
  }
  if (!data.encrypt && data.service.endsWith("_PRIVATE")) {
    throw new Error("Only encrypted data can go into private services");
  }
  if (data.file) {
    data64 = await fileToBase64(data.file);
  }
  if (data.encrypt) {
    try {
      const encryptDataResponse = encryptDataGroup({
        data64,
        publicKeys: data.publicKeys,
      });
      if (encryptDataResponse) {
        data64 = encryptDataResponse;
      }
    } catch (error) {
      throw new Error(
        error.message || "Upload failed due to failed encryption"
      );
    }
  }

  const fee = await getFee('ARBITRARY')

  const resPermission = await getUserPermission({
    text1: "Do you give this application permission to publish to QDN?",
    text2: `service: ${service}`,
    text3: `identifier: ${identifier || null}`,
    highlightedText: `isEncrypted: ${!!data.encrypt}`,
    fee: fee.fee
  });
  const { accepted } = resPermission;
  if (accepted) {
    if (data.file && !data.encrypt) {
      data64 = await fileToBase64(data.file);
    }
    try {
      const resPublish = await publishData({
        registeredName: encodeURIComponent(name),
        file: data64,
        service: service,
        identifier: encodeURIComponent(identifier),
        uploadType: "file",
        isBase64: true,
        filename: filename,
        title,
        description,
        category,
        tag1,
        tag2,
        tag3,
        tag4,
        tag5,
        apiVersion: 2,
        withFee: true,
      });
      return resPublish;
    } catch (error) {
      throw new Error(error?.message || "Upload failed");
    }
  } else {
    throw new Error("User declined request");
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
