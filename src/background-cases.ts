import {
  createEndpoint,
  getKeyPair,
  getLastRef,
  processTransactionVersion2,
} from "./background";
import Base58 from "./deps/Base58";
import { createTransaction } from "./transactions/transactions";

export async function createRewardShareCase(data) {
  const { recipientPublicKey } = data;
  const resKeyPair = await getKeyPair();
  const parsedData = JSON.parse(resKeyPair);
  const uint8PrivateKey = Base58.decode(parsedData.privateKey);
  const uint8PublicKey = Base58.decode(parsedData.publicKey);
  const keyPair = {
    privateKey: uint8PrivateKey,
    publicKey: uint8PublicKey,
  };
  let lastRef = await getLastRef();

  const tx = await createTransaction(38, keyPair, {
    recipientPublicKey,
    percentageShare: 0,
    lastReference: lastRef,
  });

  const signedBytes = Base58.encode(tx.signedBytes);

  const res = await processTransactionVersion2(signedBytes);
  if (!res?.signature)
    throw new Error("Transaction was not able to be processed");
  return res;
}

export async function removeRewardShareCase(data) {
  const { rewardShareKeyPairPublicKey, recipient, percentageShare } = data;
  const resKeyPair = await getKeyPair();
  const parsedData = JSON.parse(resKeyPair);
  const uint8PrivateKey = Base58.decode(parsedData.privateKey);
  const uint8PublicKey = Base58.decode(parsedData.publicKey);
  const keyPair = {
    privateKey: uint8PrivateKey,
    publicKey: uint8PublicKey,
  };
  let lastRef = await getLastRef();

  const tx = await createTransaction(381, keyPair, {
    rewardShareKeyPairPublicKey,
    recipient,
    percentageShare,
    lastReference: lastRef,
  });

  const signedBytes = Base58.encode(tx.signedBytes);

  const res = await processTransactionVersion2(signedBytes);
  if (!res?.signature)
    throw new Error("Transaction was not able to be processed");
  return res;
}

export async function getRewardSharePrivateKeyCase(data) {
  const { recipientPublicKey } = data;
  const resKeyPair = await getKeyPair();
  const parsedData = JSON.parse(resKeyPair);
  const uint8PrivateKey = Base58.decode(parsedData.privateKey);
  const uint8PublicKey = Base58.decode(parsedData.publicKey);
  const keyPair = {
    privateKey: uint8PrivateKey,
    publicKey: uint8PublicKey,
  };
  let lastRef = await getLastRef();

  const tx = await createTransaction(38, keyPair, {
    recipientPublicKey,
    percentageShare: 0,
    lastReference: lastRef,
  });

  return tx?._base58RewardShareSeed;
}

export async function listActionsCase(data) {
 
    const { type, listName = "", items = [] } = data;
    let responseData;

    if (type === "get") {
      const url = await createEndpoint(`/lists/${listName}`);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");

      responseData = await response.json();
    } else if (type === "remove") {
      const url = await createEndpoint(`/lists/${listName}`);
      const body = {
        items: items,
      };
      const bodyToString = JSON.stringify(body);
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyToString,
      });

      if (!response.ok) throw new Error("Failed to remove from list");
      let res;
      try {
        res = await response.clone().json();
      } catch (e) {
        res = await response.text();
      }
      responseData = res;
    } else if (type === "add") {
      const url = await createEndpoint(`/lists/${listName}`);
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

      if (!response.ok) throw new Error("Failed to add to list");
      let res;
      try {
        res = await response.clone().json();
      } catch (e) {
        res = await response.text();
      }
      responseData = res;
    }

    return responseData;
}
