import React, { useMemo, useState } from 'react'
import { useRecoilState } from 'recoil';
import isEqual from 'lodash/isEqual'; // Import deep comparison utility
import { sortablePinnedAppsAtom } from '../../atoms/global';
export const Save = () => {
    const [pinnedApps, setPinnedApps] = useRecoilState(sortablePinnedAppsAtom);
    const [oldPinnedApps, setOldPinnedApps] = useState(pinnedApps)
    console.log('oldpin', {oldPinnedApps, pinnedApps})

    const hasChanged = useMemo(()=> {
        return !isEqual(pinnedApps, oldPinnedApps)
    }, [oldPinnedApps, pinnedApps])
  return (
    <div>{hasChanged && 'Save'}</div>
  )
}
