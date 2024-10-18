import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppsHome } from './AppsHome'
import { Spacer } from '../../common/Spacer'
import { MyContext, getBaseApiReact } from '../../App'
import { AppsLibrary } from './AppsLibrary'
import { AppInfo } from './AppInfo'
import { executeEvent, subscribeToEvent, unsubscribeFromEvent } from '../../utils/events'
import { AppsNavBar } from './AppsNavBar'
import { AppsParent } from './Apps-styles'
import { AppViewer } from './AppViewer'
import AppViewerContainer from './AppViewerContainer'
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 8 });


export const Apps = ({mode, setMode, show}) => {
    const [availableQapps, setAvailableQapps] = useState([])
    const [downloadedQapps, setDownloadedQapps] = useState([])
    const [selectedAppInfo, setSelectedAppInfo] = useState(null)
    const [tabs, setTabs] = useState([])
    const [selectedTab, setSelectedTab] = useState(null)
    const [isNewTabWindow, setIsNewTabWindow] = useState(false)

    useEffect(()=> {
        setTimeout(() => {
            executeEvent('setTabsToNav', {
                data: {
                    tabs: tabs,
                selectedTab: selectedTab
                }
            })
        }, 100);
    }, [show, tabs, selectedTab])

    const getQapps = React.useCallback(
        async () => {
          try {
            let apps = []
            let websites = []
            // dispatch(setIsLoadingGlobal(true))
            const url = `${getBaseApiReact()}/arbitrary/resources/search?service=APP&mode=ALL&includestatus=true&limit=0&includemetadata=true`;
           
            const response =  await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            if(!response?.ok) return
            const responseData = await response.json();
            const urlWebsites = `${getBaseApiReact()}/arbitrary/resources/search?service=WEBSITE&mode=ALL&includestatus=true&limit=0&includemetadata=true`;
           
            const responseWebsites =  await fetch(urlWebsites, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            if(!responseWebsites?.ok) return
            const responseDataWebsites = await responseWebsites.json();
            apps = responseData
            websites = responseDataWebsites
            const combine = [...apps, ...websites] 
            setAvailableQapps(combine)
            setDownloadedQapps(combine.filter((qapp)=> qapp?.status?.status === 'READY'))
          } catch (error) {
          } finally {
            // dispatch(setIsLoadingGlobal(false))
          }
        },
        []
      );
    useEffect(()=> {
        getQapps()
    }, [getQapps])


    const selectedAppInfoFunc = (e) => {
        const data = e.detail?.data;
        setSelectedAppInfo(data)
        setMode('appInfo')
      };
    
      useEffect(() => {
        subscribeToEvent("selectedAppInfo", selectedAppInfoFunc);
    
        return () => {
          unsubscribeFromEvent("selectedAppInfo", selectedAppInfoFunc);
        };
      }, []);

      const navigateBackFunc = (e) => {
        if(mode === 'appInfo'){
            setMode('library')
        } else if(mode === 'library'){
            setMode('home')
        } else {
            const iframeId = `browser-iframe-${selectedTab?.tabId}`
            const iframe = document.getElementById(iframeId);
            console.log('iframe', iframe)
// Go Back in the iframe's history
if (iframe) {
    console.log(iframe.contentWindow)
    if (iframe && iframe.contentWindow) {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow && iframeWindow.history) {
          iframeWindow.history.back();
        }
      }
  }

        }
      };
    
      useEffect(() => {
        subscribeToEvent("navigateBack", navigateBackFunc);
    
        return () => {
          unsubscribeFromEvent("navigateBack", navigateBackFunc);
        };
      }, [mode, selectedTab]);


      const addTabFunc = (e) => {
        const data = e.detail?.data;
        const newTab = {
            ...data,
            tabId: uid.rnd()
        }
        setTabs((prev)=> [...prev, newTab])
        setSelectedTab(newTab)
        setMode('viewer')
      
        setIsNewTabWindow(false)
      };
    
      useEffect(() => {
        subscribeToEvent("addTab", addTabFunc);
    
        return () => {
          unsubscribeFromEvent("addTab", addTabFunc);
        };
      }, [tabs]);

      const setSelectedTabFunc = (e) => {
        const data = e.detail?.data;
        
       
        setSelectedTab(data)
        setTimeout(() => {
            executeEvent('setTabsToNav', {
                data: {
                    tabs: tabs,
                selectedTab: data
                }
            })
        }, 100);
        setIsNewTabWindow(false)
      };
    
      useEffect(() => {
        subscribeToEvent("setSelectedTab", setSelectedTabFunc);
    
        return () => {
          unsubscribeFromEvent("setSelectedTab", setSelectedTabFunc);
        };
      }, [tabs]);

      const removeTabFunc = (e) => {
        const data = e.detail?.data;
        const copyTabs = [...tabs].filter((tab)=> tab?.tabId !== data?.tabId)
        if(copyTabs?.length === 0){
            setMode('home')
        }
        else{
            setSelectedTab(copyTabs[0])
        }
        setTabs(copyTabs)
        setSelectedTab(copyTabs[0])
        setTimeout(() => {
            executeEvent('setTabsToNav', {
                data: {
                    tabs: copyTabs,
                selectedTab: copyTabs[0]
                }
            })
        }, 400);
        
      };
    
      useEffect(() => {
        subscribeToEvent("removeTab", removeTabFunc);
    
        return () => {
          unsubscribeFromEvent("removeTab", removeTabFunc);
        };
      }, [tabs]);

      const setNewTabWindowFunc = (e) => {
        setIsNewTabWindow(true)
        
      };
    
      useEffect(() => {
        subscribeToEvent("newTabWindow", setNewTabWindowFunc);
    
        return () => {
          unsubscribeFromEvent("newTabWindow", setNewTabWindowFunc);
        };
      }, [tabs]);

 
     

  return (
       <AppsParent sx={{
        display: !show && 'none'
       }}>
    {mode !== 'viewer' && (
            <Spacer height="30px" />

    )}
    {mode === 'home' && <AppsHome downloadedQapps={downloadedQapps} setMode={setMode} />}
    {mode === 'library' && <AppsLibrary downloadedQapps={downloadedQapps} availableQapps={availableQapps} />}
    {mode === 'appInfo' && <AppInfo app={selectedAppInfo}  />}
   
        {tabs.map((tab)=> {
            return <AppViewerContainer hide={isNewTabWindow} isSelected={tab?.tabId === selectedTab?.tabId} app={tab} />
        })}
  
    {isNewTabWindow && (
        <AppsHome downloadedQapps={downloadedQapps} setMode={setMode} />
    )}
    {mode !== 'viewer' && (
            <Spacer height="180px" />

    )}
    </AppsParent>
  )
}
