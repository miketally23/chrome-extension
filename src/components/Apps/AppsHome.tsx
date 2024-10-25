import React, { useMemo, useState } from "react";
import {
  AppCircle,
  AppCircleContainer,
  AppCircleLabel,
  AppLibrarySubTitle,
  AppsContainer,
  AppsParent,
} from "./Apps-styles";
import { Avatar, ButtonBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import { executeEvent } from "../../utils/events";
import { SortablePinnedApps } from "./SortablePinnedApps";
import { Spacer } from "../../common/Spacer";

export const AppsHome = ({  setMode, myApp, myWebsite, availableQapps  }) => {
  return (
    <>
    <AppsContainer
        sx={{
        
          justifyContent: "flex-start",
        }}
      >
    <AppLibrarySubTitle
   
  >
    Apps Dashboard

  </AppLibrarySubTitle>
  </AppsContainer>
  <Spacer height="20px" />

      <AppsContainer>
        <ButtonBase
          onClick={() => {
            setMode("library");
          }}
        >
          <AppCircleContainer>
            <AppCircle>
              <Add>+</Add>
            </AppCircle>
            <AppCircleLabel>Add</AppCircleLabel>
          </AppCircleContainer>
        </ButtonBase>
       
        <SortablePinnedApps availableQapps={availableQapps} myWebsite={myWebsite} myApp={myApp}  />
    
      </AppsContainer>
      </>
  );
};
