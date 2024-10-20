import React, { useMemo, useState } from "react";
import {
  AppCircle,
  AppCircleContainer,
  AppCircleLabel,
  AppsContainer,
  AppsParent,
} from "./Apps-styles";
import { Avatar, ButtonBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import { executeEvent } from "../../utils/events";
import { SortablePinnedApps } from "./SortablePinnedApps";

export const AppsHome = ({  setMode, myApp, myWebsite, availableQapps  }) => {
  return (
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
  );
};
