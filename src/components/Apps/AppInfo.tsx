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
  AppsCategoryInfo,
  AppsCategoryInfoLabel,
  AppsCategoryInfoSub,
  AppsCategoryInfoValue,
  AppsInfoDescription,
  AppsLibraryContainer,
  AppsParent,
  AppsWidthLimiter,
} from "./Apps-styles";
import { Avatar, Box, ButtonBase, InputBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";

import { Spacer } from "../../common/Spacer";
import { executeEvent } from "../../utils/events";
import { AppRating } from "./AppRating";

export const AppInfo = ({ app, myName }) => {
  const isInstalled = app?.status?.status === "READY";
  return (
    <AppsLibraryContainer>
      <AppsWidthLimiter>
        <AppInfoSnippetContainer>
          <AppInfoSnippetLeft
            sx={{
              flexGrow: 1,
              gap: "18px",
            }}
          >
            <AppCircleContainer
              sx={{
                width: "auto",
              }}
            >
              <AppCircle
                sx={{
                  border: "none",
                  height: "100px",
                  width: "100px",
                }}
              >
                <Avatar
                  sx={{
                    height: "43px",
                    width: "43px",
                    "& img": {
                      objectFit: "fill",
                    },
                  }}
                  alt={app?.name}
                  src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                    app?.name
                  }/qortal_avatar?async=true`}
                >
                  <img
                    style={{
                      width: "43px",
                      height: "auto",
                    }}
                    src={LogoSelected}
                    alt="center-icon"
                  />
                </Avatar>
              </AppCircle>
            </AppCircleContainer>
            <AppInfoSnippetMiddle>
              <AppInfoAppName>
                {app?.metadata?.title || app?.name}
              </AppInfoAppName>
              <Spacer height="6px" />
              <AppInfoUserName>{app?.name}</AppInfoUserName>
              <Spacer height="3px" />
            </AppInfoSnippetMiddle>
          </AppInfoSnippetLeft>
          <AppInfoSnippetRight></AppInfoSnippetRight>
        </AppInfoSnippetContainer>
        <Spacer height="11px" />
        <AppDownloadButton
          onClick={() => {
            executeEvent("addTab", {
              data: app,
            });
          }}
          sx={{
            backgroundColor: isInstalled ? "#0091E1" : "#247C0E",
            width: "100%",
            maxWidth: "320px",
            height: "29px",
          }}
        >
          <AppDownloadButtonText>
            {isInstalled ? "Open" : "Download"}
          </AppDownloadButtonText>
        </AppDownloadButton>
      </AppsWidthLimiter>
      <Spacer height="20px" />
        <AppsWidthLimiter>

      <AppsCategoryInfo>
        <AppRating ratingCountPosition="top" myName={myName} app={app} />
        <Spacer width="16px" />
        <Spacer height="40px" width="1px" backgroundColor="white" />
        <Spacer width="16px" />
        <AppsCategoryInfoSub>
          <AppsCategoryInfoLabel>Category:</AppsCategoryInfoLabel>
          <Spacer height="4px" />
          <AppsCategoryInfoValue>
            {app?.metadata?.categoryName || "none"}
          </AppsCategoryInfoValue>
        </AppsCategoryInfoSub>
      </AppsCategoryInfo>
      <Spacer height="30px" />
      <AppInfoAppName>
      About this Q-App
        </AppInfoAppName>
      </AppsWidthLimiter>
      <Spacer height="20px" />
      <AppsInfoDescription>
      {app?.metadata?.description || "No description"}
      </AppsInfoDescription>
    </AppsLibraryContainer>
  );
};
