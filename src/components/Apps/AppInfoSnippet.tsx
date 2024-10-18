import React, { useEffect, useMemo, useState } from "react";
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
} from "./Apps-styles";
import { Avatar, Box, ButtonBase, InputBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";

import { Spacer } from "../../common/Spacer";
import { executeEvent } from "../../utils/events";

export const AppInfoSnippet = ({ app }) => {


  const isInstalled = app?.status?.status === 'READY'
  return (
    <AppInfoSnippetContainer>
      <AppInfoSnippetLeft>
      <ButtonBase
        sx={{
          height: "80px",
          width: "60px",
        }}
        onClick={()=> {
          executeEvent("selectedAppInfo", {
            data: app,
          });
        }}
      >
        <AppCircleContainer>
          <AppCircle
            sx={{
              border: "none",
            }}
          >
            <Avatar
              sx={{
                height: "31px",
                width: "31px",
                '& img': { 
                  objectFit: 'fill',
                }
              }}
              alt={app?.name}
              src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                app?.name
              }/qortal_avatar?async=true`}
            >
              <img
                style={{
                  width: "31px",
                  height: "auto",
                }}
                src={LogoSelected}
                alt="center-icon"
              />
            </Avatar>
          </AppCircle>
        </AppCircleContainer>
      </ButtonBase>
      <AppInfoSnippetMiddle>
        <ButtonBase onClick={()=> {
          executeEvent("selectedAppInfo", {
            data: app,
          });
        }}>
        <AppInfoAppName   >
        {app?.metadata?.title || app?.name}
        </AppInfoAppName>
        </ButtonBase>
        <Spacer height="6px" />
        <AppInfoUserName>
        { app?.name}
          </AppInfoUserName>
          <Spacer height="3px" />
      </AppInfoSnippetMiddle>
      </AppInfoSnippetLeft>
      <AppInfoSnippetRight>
        <AppDownloadButton onClick={()=> {
                executeEvent("addTab", {
                  data: app
                })
              }}  sx={{
          backgroundColor: isInstalled ? '#0091E1' : '#247C0E',
        
        }}>
          <AppDownloadButtonText>{isInstalled ? 'Open' : 'Download'}</AppDownloadButtonText>
        </AppDownloadButton>
      </AppInfoSnippetRight>
    </AppInfoSnippetContainer>
  );
};
