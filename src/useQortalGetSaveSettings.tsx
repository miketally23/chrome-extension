import React, { useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { canSaveSettingToQdnAtom, sortablePinnedAppsAtom } from './atoms/global';
import { getArbitraryEndpointReact, getBaseApiReact } from './App';
import { decryptResource } from './components/Group/Group';
import { base64ToUint8Array, uint8ArrayToObject } from './backgroundFunctions/encryption';

function fetchFromLocalStorage(key) {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            console.log(`No data found for key: ${key}`);
            return null;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Error fetching from localStorage:', error);
        return null;
    }
}

const getPublishRecord = async (myName) => {
    // const validApi = await findUsableApi();
    const url = `${getBaseApiReact()}${getArbitraryEndpointReact()}?mode=ALL&service=DOCUMENT_PRIVATE&identifier=ext_saved_settings&exactmatchnames=true&limit=1&prefix=true&name=${myName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("network error");
    }
    const publishData = await response.json();

    if(publishData?.length > 0) return true

    return false
  };
  const getPublish = async (myName) => {
    let data
    const res = await fetch(
        `${getBaseApiReact()}/arbitrary/DOCUMENT_PRIVATE/${myName}/ext_saved_settings?encoding=base64`
      );
      data = await res.text();
    

    if(!data) throw new Error('Unable to fetch publish')

    const decryptedKey: any = await decryptResource(data);

    const dataint8Array = base64ToUint8Array(decryptedKey.data);
    const decryptedKeyToObject = uint8ArrayToObject(dataint8Array);
    return decryptedKeyToObject
  };

export const useQortalGetSaveSettings = (myName) => {
    const setSortablePinnedApps = useSetRecoilState(sortablePinnedAppsAtom);
    const setCanSave = useSetRecoilState(canSaveSettingToQdnAtom);

    
    const getSavedSettings = useCallback(async (myName)=> {
        try {
         const hasPublishRecord =    await getPublishRecord(myName)
         if(hasPublishRecord){
            const settings = await getPublish(myName)
            if(settings?.sortablePinnedApps){
                fetchFromLocalStorage('sortablePinnedApps', settings.sortablePinnedApps)
                setSortablePinnedApps(settings.sortablePinnedApps)
            }
         }
         setCanSave(true)
        } catch (error) {
            
        }
    }, [])
    useEffect(()=> {
        if(!myName) return
        getSavedSettings(myName)
    }, [getSavedSettings, myName])
 
}
