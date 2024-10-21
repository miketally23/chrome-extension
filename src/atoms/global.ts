import { atom } from 'recoil';


export const sortablePinnedAppsAtom = atom({
  key: 'sortablePinnedAppsFromAtom', 
  default: [], 
});

export const canSaveSettingToQdnAtom = atom({
  key: 'canSaveSettingToQdnAtom', 
  default: false, 
});

export const settingsQDNLastUpdatedAtom = atom({
  key: 'settingsQDNLastUpdatedAtom', 
  default: -100, 
});

export const settingsLocalLastUpdatedAtom = atom({
  key: 'settingsLocalLastUpdatedAtom', 
  default: 0, 
});

export const oldPinnedAppsAtom = atom({
  key: 'oldPinnedAppsAtom', 
  default: [], 
});