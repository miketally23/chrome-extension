import { atom } from 'recoil';


export const sortablePinnedAppsAtom = atom({
  key: 'sortablePinnedAppsFromAtom', 
  default: [], 
});

export const canSaveSettingToQdnAtom = atom({
  key: 'canSaveSettingToQdnAtom', 
  default: false, 
});