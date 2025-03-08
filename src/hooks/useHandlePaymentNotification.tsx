import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getBaseApiReact } from '../App';
import { addTimestampLatestPayment, checkDifference, getNameInfoForOthers, getTimestampLatestPayment } from '../background';
import { useRecoilState } from 'recoil';
import { lastPaymentSeenTimestampAtom } from '../atoms/global';
import { subscribeToEvent, unsubscribeFromEvent } from '../utils/events';

export const useHandlePaymentNotification = (address) => {
    const [latestTx, setLatestTx] = useState(null);

    const nameAddressOfSender = useRef({})
    const isFetchingName = useRef({})
  
  
    const [lastEnteredTimestampPayment, setLastEnteredTimestampPayment] =
      useRecoilState(lastPaymentSeenTimestampAtom);
  
    useEffect(() => {
      if (lastEnteredTimestampPayment && address) {
        addTimestampLatestPayment(Date.now()).catch((error) => {
          console.error(error);
        });
      }
    }, [lastEnteredTimestampPayment, address]);
  
    const getNameOrAddressOfSender =  useCallback(async(senderAddress)=> {
      if(isFetchingName.current[senderAddress]) return senderAddress
      try {
        isFetchingName.current[senderAddress] = true
        const res = await getNameInfoForOthers(senderAddress)
        nameAddressOfSender.current[senderAddress] = res || senderAddress
      } catch (error) {
        console.error(error)
      } finally {
        isFetchingName.current[senderAddress] = false
      }
      
    }, [])

    const getNameOrAddressOfSenderMiddle =  useCallback(async(senderAddress)=> {
      getNameOrAddressOfSender(senderAddress)
      return senderAddress
      
    }, [getNameOrAddressOfSender])
  
    const hasNewPayment = useMemo(() => {
      if (!latestTx) return false;
      if (!checkDifference(latestTx?.timestamp, 86400000)) return false;
      if (
        !lastEnteredTimestampPayment ||
        lastEnteredTimestampPayment < latestTx?.timestamp
      )
        return true;
  
      return false;
    }, [lastEnteredTimestampPayment, latestTx]);

  
    const getLastSeenData = useCallback(async () => {
      try {
        if (!address) return;
  
        const res = await getTimestampLatestPayment<any>().catch(() => null);
        if (res) {
          setLastEnteredTimestampPayment(res);
        }
  
        const response = await fetch(
          `${getBaseApiReact()}/transactions/search?txType=PAYMENT&address=${address}&confirmationStatus=CONFIRMED&limit=5&reverse=true`
        );
  
        const responseData = await response.json();
        const latestTx = responseData.filter(
          (tx) => tx?.creatorAddress !== address && tx?.recipient === address
        )[0];
        if (!latestTx) {
          return; // continue to the next group
        }
  
        setLatestTx(latestTx);
      } catch (error) {
        console.error(error);
      }
    }, [address, setLastEnteredTimestampPayment]);
  
  
    useEffect(() => {
      getLastSeenData();      

      chrome?.runtime?.onMessage.addListener((message, sender, sendResponse) => {
        if (message?.action === "SET_PAYMENT_ANNOUNCEMENT" && message?.payload) {
          setLatestTx(message.payload);
        }
      });
      }, [getLastSeenData]);

      const setLastEnteredTimestampPaymentEventFunc = useCallback(
        (e) => {
            setLastEnteredTimestampPayment(Date.now)
        },
        [setLastEnteredTimestampPayment]
      );
    
      useEffect(() => {
        subscribeToEvent("setLastEnteredTimestampPaymentEvent", setLastEnteredTimestampPaymentEventFunc);
    
        return () => {
          unsubscribeFromEvent("setLastEnteredTimestampPaymentEvent", setLastEnteredTimestampPaymentEventFunc);
        };
      }, [setLastEnteredTimestampPaymentEventFunc]);
  return {
    latestTx,
    getNameOrAddressOfSenderMiddle,
    hasNewPayment,
    setLastEnteredTimestampPayment,
    nameAddressOfSender
  }
}
