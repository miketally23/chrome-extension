import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AppCircle,
  AppCircleContainer,
  AppCircleLabel,
  AppDownloadButton,
  AppDownloadButtonText,
  AppInfoAppName,
  AppInfoSnippetContainer,
  AppInfoSnippetLeft,
  AppInfoSnippetMiddle,
  AppInfoSnippetRight,
  AppInfoUserName,
  AppsLibraryContainer,
  AppsParent,
} from "./Apps-styles";
import { Avatar, Box, ButtonBase, InputBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { MyContext, getBaseApiReact, isMobile } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";

import { Spacer } from "../../common/Spacer";
import { executeEvent, subscribeToEvent, unsubscribeFromEvent } from "../../utils/events";
import { useFrame } from "react-frame-component";
import { useQortalMessageListener } from "./useQortalMessageListener";




export const AppViewer = ({ app }) => {
  const { rootHeight } = useContext(MyContext);
  const iframeRef = useRef(null);
  const { document, window } = useFrame();
  const {path} = useQortalMessageListener(window) 
  const [url, setUrl] = useState('')

  useEffect(()=> {
    setUrl(`${getBaseApiReact()}/render/${app?.service}/${app?.name}${app?.path != null ? app?.path : ''}?theme=dark&identifier=${(app?.identifier != null && app?.identifier != 'null') ? app?.identifier : ''}`)
  }, [app?.service, app?.name, app?.identifier, app?.path])
  const defaultUrl = useMemo(()=> {
    return  url
  }, [url])



  const refreshAppFunc = (e) => {
    const {tabId} = e.detail
    if(tabId === app?.tabId){
      const constructUrl = `${getBaseApiReact()}/render/${app?.service}/${app?.name}${path != null ? path : ''}?theme=dark&identifier=${app?.identifier != null ? app?.identifier : ''}&time=${new Date().getMilliseconds()}`
      setUrl(constructUrl)
    }
  };

  useEffect(() => {
    subscribeToEvent("refreshApp", refreshAppFunc);

    return () => {
      unsubscribeFromEvent("refreshApp", refreshAppFunc);
    };
  }, [app, path]);

  return (
        <iframe ref={iframeRef} style={{
          height: !isMobile ? '100vh' : `calc(${rootHeight} - 60px - 45px )`,
          border: 'none',
          width: '100%'
        }} id="browser-iframe" src={defaultUrl} sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals" allow="fullscreen">
    						
    						</iframe>
  );
};
