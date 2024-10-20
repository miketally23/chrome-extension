import React, { useCallback, useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { sortablePinnedAppsAtom } from './atoms/global';

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

export const useRetrieveDataLocalStorage = () => {
    const setSortablePinnedApps = useSetRecoilState(sortablePinnedAppsAtom);

    
    const getSortablePinnedApps = useCallback(()=> {
        const pinnedAppsLocal = fetchFromLocalStorage('sortablePinnedApps')
        if(pinnedAppsLocal){
            setSortablePinnedApps(pinnedAppsLocal)
        }
    }, [])
    useEffect(()=> {
      
        getSortablePinnedApps()
    }, [getSortablePinnedApps])
 
}
