
export const storeWalletInfo = (payload: any)=> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({walletInfo: payload}, () => {
            if (chrome.runtime.lastError) {
                reject(new Error('Error saving data'));
            } else {
                resolve('Data saved successfully');
            }
        });
    });
}

export const getWalletInfo = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['walletInfo'], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error('Error retrieving data'));
            } else if (result.walletInfo) {
                resolve(result.walletInfo as any);
            } else {
                reject(new Error('No wallet info found'));
            }
        });
    });
};


