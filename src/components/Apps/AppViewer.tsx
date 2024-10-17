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
import { MyContext, getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";

import { Spacer } from "../../common/Spacer";
import { executeEvent } from "../../utils/events";

export const AppViewer = ({ app }) => {
  const { rootHeight } = useContext(MyContext);
  const iframeRef = useRef(null);


  const url = useMemo(()=> {
    return  `${getBaseApiReact()}/render/${app?.service}/${app?.name}${app?.path != null ? app?.path : ''}?theme=dark&identifier=${(app?.identifier != null && app?.identifier != 'null') ? app?.identifier : ''}`
  }, [app?.service, app?.name, app?.identifier, app?.path])

 


  return (
        <iframe ref={iframeRef} style={{
          height: `calc(${rootHeight} - 60px - 45px)`,
          border: 'none',
          width: '100%'
        }} id="browser-iframe" src={url} sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals" allow="fullscreen">
    						
    						</iframe>
  );
};
